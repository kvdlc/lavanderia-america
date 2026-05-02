export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="mb-4 h-1 w-16 rounded-full bg-brand-red" />
        <h1 className="text-3xl font-extrabold text-brand-blue lg:text-4xl">
          T&eacute;rminos y Condiciones
        </h1>
        <p className="mt-2 text-gray-500">Lavander&iacute;a Industrial</p>

        <div className="card-premium mt-10 space-y-8 p-8 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-brand-blue">Aceptaci&oacute;n de t&eacute;rminos</h2>
            <p className="mt-3 leading-relaxed">
              Al utilizar nuestro sitio web y contratar nuestros servicios, usted acepta expresamente
              los presentes t&eacute;rminos y condiciones. Si no est&aacute; de acuerdo con ellos, le
              solicitamos que no utilice nuestros servicios. Nos reservamos el derecho de modificar
              estos t&eacute;rminos en cualquier momento, notificando los cambios en esta p&aacute;gina.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Servicios ofrecidos</h2>
            <p className="mt-3 leading-relaxed">
              Ofrecemos servicios de lavander&iacute;a industrial que incluyen lavado, secado y
              planchado de frazadas, edredones, s&aacute;banas, uniformes y ropa de trabajo. Los
              servicios se prestan conforme a las especificaciones indicadas en nuestro cat&aacute;logo
              y est&aacute;n sujetos a disponibilidad. Nos reservamos el derecho de rechazar pedidos
              que excedan la capacidad operativa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Obligaciones del cliente</h2>
            <p className="mt-3 leading-relaxed">
              El cliente se compromete a proporcionar informaci&oacute;n veraz y completa al momento
              de registrarse y realizar pedidos. Asimismo, debe asegurarse de que las prendas
              entregadas no contengan objetos extra&ntilde;os que puedan da&ntilde;ar los equipos o
              contaminar otras prendas. La empresa no se responsabiliza por da&ntilde;os causados por
              objetos olvidados en las prendas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Pagos y facturaci&oacute;n</h2>
            <p className="mt-3 leading-relaxed">
              Los precios de nuestros servicios se muestran en soles peruanos (S/) e incluyen el
              IGV. Aceptamos pagos mediante los m&eacute;todos indicados en la plataforma de pago.
              La factura se emitir&aacute; una vez confirmado el pago. Nos reservamos el derecho de
              modificar los precios, notificando previamente a los clientes registrados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Entregas y plazos</h2>
            <p className="mt-3 leading-relaxed">
              Los plazos de entrega son estimados y se informan al momento de realizar el pedido.
              Haremos todo lo posible para cumplir con los tiempos indicados; sin embargo, no nos
              hacemos responsables por retrasos ocasionados por circunstancias imprevistas o fuera
              de nuestro control razonable. Las entregas se realizan en la direcci&oacute;n registrada
              por el cliente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Limitaci&oacute;n de responsabilidad</h2>
            <p className="mt-3 leading-relaxed">
              Nuestra responsabilidad se limita al valor del servicio contratado. No respondemos por
              da&ntilde;os indirectos o lucro cesante. Las prendas ser&aacute;n tratadas con los
              procedimientos est&aacute;ndar de la industria; no obstante, ciertos tejidos o
              materiales pueden sufrir desgaste natural. El cliente declara conocer los riesgos
              propios del proceso de lavander&iacute;a industrial.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-brand-blue">Modificaciones</h2>
            <p className="mt-3 leading-relaxed">
              Podemos actualizar estos t&eacute;rminos peri&oacute;dicamente. La versi&oacute;n
              vigente se publicar&aacute; siempre en esta p&aacute;gina. Se recomienda a los usuarios
              revisar los t&eacute;rminos antes de cada contrataci&oacute;n. El uso continuado de
              nuestros servicios constituye la aceptaci&oacute;n de las modificaciones.
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
