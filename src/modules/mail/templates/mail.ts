export const TenantInvitationTemplate = (
  inviteUrl: string | null = null,
  companyName: string,
  role?: string,
) => {
  return `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Integración al equipo</title>
  </head>
  <body style="margin: 0; padding: 0; background: #f4f4f4">
    <div
      style="
        font-family: Arial, Helvetica, sans-serif;
        background: #f4f4f4;
        padding: 40px 20px;
      "
    >
      <div
        style="
          max-width: 560px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 10px;
          padding: 40px 32px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        "
      >
        <h2 style="margin: 0 0 20px; color: #222; font-size: 24px">
          Te dieron acceso a ${companyName}
        </h2>

        <p
          style="
            color: #555;
            font-size: 15px;
            line-height: 1.6;
            margin: 0 0 16px;
          "
        >
          Se creó un acceso para vos dentro del espacio de trabajo de
          <strong>${companyName}</strong>.
        </p>

        ${
          role
            ? `
        <p
          style="
            color: #555;
            font-size: 15px;
            line-height: 1.6;
            margin: 0 0 16px;
          "
        >
          Tu perfil inicial será: <strong>${role}</strong>.
        </p>
        `
            : ''
        }

        <p
          style="
            color: #555;
            font-size: 15px;
            line-height: 1.6;
            margin: 0 0 28px;
          "
        >
          Para completar la integración y acceder a la plataforma, hacé clic en
          el siguiente botón.
        </p>

        <a
          href="${inviteUrl}"
          style="
            display: inline-block;
            padding: 14px 24px;
            background: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 15px;
          "
        >
          Acceder al espacio de trabajo
        </a>

        <p
          style="
            color: #777;
            font-size: 14px;
            line-height: 1.6;
            margin-top: 32px;
          "
        >
          Si el botón no funciona, copiá y pegá el siguiente enlace en tu
          navegador:
        </p>

        <p style="word-break: break-all; color: #007bff; font-size: 14px">
          ${inviteUrl}
        </p>

        <hr
          style="
            border: none;
            border-top: 1px solid #e5e5e5;
            margin: 32px 0 20px;
          "
        />

        <p style="color: #888; font-size: 13px; line-height: 1.5; margin: 0">
          Si no esperabas este correo, podés ignorarlo. El acceso solo será
          válido si fue solicitado por un administrador de
          <strong>${companyName}</strong>.
        </p>
      </div>
    </div>
  </body>
</html>
`;
};
