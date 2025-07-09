from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def sendmail(html, asunto, para):
    try:
        mensaje = EmailMultiAlternatives(
            subject=asunto,
            body=html,
            from_email=settings.EMAIL_HOST_USER,
            to=[para]
        )
        mensaje.attach_alternative(html, "text/html")
        mensaje.send()
    except Exception as e:
        print("❌ Error al enviar correo:", str(e))