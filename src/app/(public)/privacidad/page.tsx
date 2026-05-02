export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="mb-4 h-1 w-16 rounded-full bg-brand-red" />
        <h1 className="text-3xl font-extrabold text-brand-blue lg:text-4xl">
          Pol&iacute;tica de Privacidad
        </h1>
        <p className="mt-2 text-gray-500">Lavander&iacute;a Industrial</p>

        <div className="card-premium mt-10 space-y-8 p-8 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-brand-blue">Informaci&oacute;n que recopilamos</h2>
            <p className="mt-3 leading-relaxed">
              Recopilamos datos personales que usted nos proporciona voluntariamente al registrarse,
              realizar un pedido o contactarnos: nombre, correo electr&oacute;nico, tel&eacute;fono,
              direcci&oacute;n de entrega y datos de facturaci&oacute;n. Tambi&eacute;n recopilamos
              informaci&oacute;n de uso del sitio web mediante herramientas de an&aacute;lisis para
              mejorar nuestros servicios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Uso de la informaci&oacute;n</h2>
            <p className="mt-3 leading-relaxed">
              Utilizamos sus datos para procesar pedidos, coordinar entregas, emitir comprobantes de
              pago y brindar atenci&oacute;n al cliente. No compartimos su informaci&oacute;n con
              terceros, salvo cuando sea necesario para cumplir con el servicio contratado o por
              requerimiento legal de las autoridades competentes conforme a la legislaci&oacute;n
              peruana.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Protecci&oacute;n de datos</h2>
            <p className="mt-3 leading-relaxed">
              Implementamos medidas de seguridad t&eacute;cnicas y organizativas para proteger sus
              datos contra accesos no autorizados, alteraciones o divulgaciones indebidas. Sus datos
              se almacenan en servidores seguros y el acceso est&aacute; restringido &uacute;nicamente
              al personal autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Cookies</h2>
            <p className="mt-3 leading-relaxed">
              Utilizamos cookies propias y de terceros para mejorar la experiencia de navegaci&oacute;n,
              analizar el tr&aacute;fico del sitio y recordar sus preferencias. Usted puede configurar
              su navegador para rechazar cookies, aunque esto podr&iacute;a afectar algunas
              funcionalidades del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Derechos del usuario</h2>
            <p className="mt-3 leading-relaxed">
              De acuerdo con la Ley N&deg; 29733 &mdash; Ley de Protecci&oacute;n de Datos Personales,
              usted tiene derecho a acceder, rectificar, cancelar y oponerse al tratamiento de sus
              datos personales. Para ejercer estos derechos, env&iacute;e una solicitud a nuestro
              correo electr&oacute;nico detallado en la secci&oacute;n de contacto.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Contacto</h2>
            <p className="mt-3 leading-relaxed">
              Si tiene preguntas sobre esta pol&iacute;tica, puede contactarnos a trav&eacute;s de
              nuestro formulario de contacto en el sitio web o escribiendo al correo
              electr&oacute;nico designado para consultas de privacidad.
            </p>
          </section>

          <p className="mt-8 border-t border-gray-100 pt-6 text-sm text-gray-400">
            &Uacute;ltima actualizaci&oacute;n: 01 de mayo de 2026
          </p>
        </div>
      </div>
    </div>
  );
}
