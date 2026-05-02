const PARTNERS = [
  { name: "Minera Yanacocha", logo: null },
  { name: "Compañía Minera Antamina", logo: null },
  { name: "Sociedad Minera Cerro Verde", logo: null },
  { name: "Minera Las Bambas", logo: null },
  { name: "Compañía de Minas Buenaventura", logo: null },
  { name: "Southern Peru Copper", logo: null },
];

export function TrustedPartners() {
  return (
    <section id="confianza" className="bg-slate-100 px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="brand-divider-red mx-auto mb-4" />
          <h2 className="section-title">Conf&iacute;an en Nosotros</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            Empresas l&iacute;deres del sector minero y corporativo ya trabajan con Lavander&iacute;a
            Am&eacute;rica.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="group flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-400 grayscale transition-all duration-300 group-hover:bg-brand-blue/10 group-hover:text-brand-blue group-hover:grayscale-0">
                {partner.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 3)}
              </div>
              <span className="mt-3 text-center text-xs font-medium text-gray-500 transition-colors group-hover:text-brand-blue">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
