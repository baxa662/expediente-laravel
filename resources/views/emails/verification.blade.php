<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verificación de correo electrónico</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 30px;
            border: 1px solid #e2e8f0;
            border-top: none;
            border-radius: 0 0 8px 8px;
        }
        .code {
            background-color: #f8fafc;
            border: 1px dashed #cbd5e1;
            padding: 15px 25px;
            font-size: 24px;
            letter-spacing: 2px;
            text-align: center;
            margin: 25px 0;
            font-weight: bold;
            color: #1e293b;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #64748b;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>Verifica tu correo electrónico</h2>
    </div>
    
    <div class="content">
        <p>Hola {{ $userName }},</p>
        
        <p>Gracias por registrarte. Por favor, utiliza el siguiente código para verificar tu dirección de correo electrónico:</p>
        
        <div class="code">
            {{ $verificationCode }}
        </div>
        
        <p>Este código expirará en 24 horas. Si no has solicitado este correo, puedes ignorarlo de forma segura.</p>
        
        <p>Saludos,<br>El equipo de {{ config('app.name') }}</p>
    </div>
    
    <div class="footer">
        <p>© {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.</p>
        <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
</body>
</html>
