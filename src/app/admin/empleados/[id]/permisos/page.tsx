"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import type { Permission, EmployeePermission, Profile } from "@/types";

export default function PermisosEmpleadoPage() {
  const params = useParams();
  const userId = params.id as string;
  const [employee, setEmployee] = useState<Profile | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("permissions").select("*").order("slug"),
      supabase.from("employee_permissions").select("*").eq("user_id", userId),
    ]).then(([profileRes, permsRes, assignedRes]) => {
      if (profileRes.error) setError(profileRes.error.message);
      else setEmployee(profileRes.data);

      if (permsRes.data) setAllPermissions(permsRes.data);

      const assignedSet = new Set<string>();
      if (assignedRes.data) {
        assignedRes.data.forEach((ep: EmployeePermission) => assignedSet.add(ep.permission_id));
      }
      setAssigned(assignedSet);
      setLoading(false);
    });
  }, [userId]);

  const togglePermission = (permissionId: string) => {
    const next = new Set(assigned);
    if (next.has(permissionId)) next.delete(permissionId);
    else next.add(permissionId);
    setAssigned(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    const { error: delErr } = await supabase
      .from("employee_permissions")
      .delete()
      .eq("user_id", userId);

    if (delErr) {
      setError(delErr.message);
      setSaving(false);
      return;
    }

    if (assigned.size > 0) {
      const inserts = Array.from(assigned).map((permId) => ({
        user_id: userId,
        permission_id: permId,
        granted_by: null,
      }));

      const { error: insErr } = await supabase
        .from("employee_permissions")
        .insert(inserts);

      if (insErr) {
        setError(insErr.message);
        setSaving(false);
        return;
      }
    }

    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error && !employee) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600">Error: {error}</p>
        <Link href="/admin/empleados"><Button variant="outline">Volver a Empleados</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Link href="/admin/empleados" className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue">
        <ArrowLeft className="h-4 w-4" />
        Volver a Empleados
      </Link>
      <div>
        <h2 className="text-2xl font-bold text-brand-blue">Permisos</h2>
        <p className="text-sm text-gray-500">{employee?.full_name}</p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm">Permisos guardados correctamente</div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Permisos Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          {allPermissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay permisos configurados</p>
          ) : (
            <div className="space-y-1">
              {allPermissions.map((perm) => (
                <label key={perm.id} className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assigned.has(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                  />
                  <div>
                    <p className="font-medium text-sm">{perm.slug}</p>
                    {perm.description && <p className="text-xs text-gray-500">{perm.description}</p>}
                  </div>
                </label>
              ))}
            </div>
          )}
          <div className="pt-4">
            <Button onClick={handleSave} disabled={saving} className="bg-brand-blue hover:bg-brand-blue/90">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar Permisos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
