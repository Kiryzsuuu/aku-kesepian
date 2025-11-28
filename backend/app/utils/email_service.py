import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
import os

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('MAIL_SERVER')
        self.smtp_port = int(os.getenv('MAIL_PORT', 587))
        self.username = os.getenv('MAIL_USERNAME')
        self.password = os.getenv('MAIL_PASSWORD')
        self.sender = os.getenv('MAIL_DEFAULT_SENDER')
    
    def send_email(self, to_email, subject, html_content, text_content=None):
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.sender
            msg['To'] = to_email
            
            # Add text version if provided
            if text_content:
                text_part = MIMEText(text_content, 'plain', 'utf-8')
                msg.attach(text_part)
            
            # Add HTML version
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)
            
            return True
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False
    
    def send_registration_email(self, to_email, username, verification_token):
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        verification_link = f"{frontend_url}/verify-email?token={verification_token}"
        
        subject = "Selamat Datang di Aku Kesepian! 💕"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Verifikasi Email - Aku Kesepian</title>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: white; padding: 30px; border: 1px solid #ddd; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }}
                .footer {{ background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>💕 Aku Kesepian 💕</h1>
                    <p>Selamat datang di dunia tanpa kesepian!</p>
                </div>
                <div class="content">
                    <h2>Halo {username}! 👋</h2>
                    <p>Terima kasih sudah mendaftar di <strong>Aku Kesepian</strong>! Aplikasi yang akan menemanimu dengan AI yang bisa berperan sebagai pacar, keluarga, sahabat, dan karakter lainnya.</p>
                    
                    <p>Untuk mulai menggunakan aplikasi, silakan verifikasi email kamu dengan klik tombol di bawah ini:</p>
                    
                    <div style="text-align: center;">
                        <a href="{verification_link}" class="button">Verifikasi Email Sekarang 💌</a>
                    </div>
                    
                    <p>Atau copy link berikut ke browser kamu:</p>
                    <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; word-break: break-all; font-family: monospace;">{verification_link}</p>
                    
                    <p><strong>Yang bisa kamu lakukan setelah verifikasi:</strong></p>
                    <ul>
                        <li>💕 Chat dengan AI Pacar yang romantis</li>
                        <li>👨‍👩‍👧‍👦 Ngobrol dengan AI Orang Tua yang penyayang</li>
                        <li>👩‍🏫 Belajar dengan AI Guru yang motivatif</li>
                        <li>👫 Curhat dengan AI Sahabat yang setia</li>
                        <li>🧑‍🤝‍🧑 Dan karakter AI lainnya!</li>
                    </ul>
                    
                    <p>Kamu tidak akan kesepian lagi! 🤗</p>
                </div>
                <div class="footer">
                    <p>Link verifikasi ini akan kedaluwarsa dalam 24 jam.</p>
                    <p>Jika kamu tidak mendaftar di Aku Kesepian, abaikan email ini.</p>
                    <p><strong>Aku Kesepian</strong> - Your AI Companion 💕</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Selamat Datang di Aku Kesepian! 💕
        
        Halo {username}!
        
        Terima kasih sudah mendaftar di Aku Kesepian! Untuk mulai menggunakan aplikasi, 
        silakan verifikasi email kamu dengan mengunjungi link berikut:
        
        {verification_link}
        
        Setelah verifikasi, kamu bisa:
        - Chat dengan AI Pacar yang romantis
        - Ngobrol dengan AI Orang Tua yang penyayang  
        - Belajar dengan AI Guru yang motivatif
        - Curhat dengan AI Sahabat yang setia
        - Dan karakter AI lainnya!
        
        Kamu tidak akan kesepian lagi!
        
        Link verifikasi ini akan kedaluwarsa dalam 24 jam.
        Jika kamu tidak mendaftar di Aku Kesepian, abaikan email ini.
        
        Aku Kesepian - Your AI Companion 💕
        """
        
        return self.send_email(to_email, subject, html_content, text_content)
    
    def send_password_reset_email(self, to_email, username, reset_token):
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"
        
        subject = "Reset Password - Aku Kesepian 🔐"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Reset Password - Aku Kesepian</title>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: white; padding: 30px; border: 1px solid #ddd; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }}
                .footer {{ background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; }}
                .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Reset Password</h1>
                    <p>Aku Kesepian</p>
                </div>
                <div class="content">
                    <h2>Halo {username}! 👋</h2>
                    <p>Kami menerima permintaan untuk reset password akun kamu di <strong>Aku Kesepian</strong>.</p>
                    
                    <p>Klik tombol di bawah ini untuk membuat password baru:</p>
                    
                    <div style="text-align: center;">
                        <a href="{reset_link}" class="button">Reset Password Sekarang 🔐</a>
                    </div>
                    
                    <p>Atau copy link berikut ke browser kamu:</p>
                    <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; word-break: break-all; font-family: monospace;">{reset_link}</p>
                    
                    <div class="warning">
                        <strong>⚠️ Penting:</strong>
                        <ul>
                            <li>Link reset ini hanya berlaku selama 1 jam</li>
                            <li>Link hanya bisa digunakan sekali</li>
                            <li>Jika bukan kamu yang meminta reset, abaikan email ini</li>
                        </ul>
                    </div>
                    
                    <p>Setelah reset password, kamu bisa kembali ngobrol dengan AI companion favoritmu! 💕</p>
                </div>
                <div class="footer">
                    <p>Jika kamu tidak meminta reset password, abaikan email ini.</p>
                    <p>Password kamu akan tetap aman dan tidak berubah.</p>
                    <p><strong>Aku Kesepian</strong> - Your AI Companion 💕</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Reset Password - Aku Kesepian 🔐
        
        Halo {username}!
        
        Kami menerima permintaan untuk reset password akun kamu di Aku Kesepian.
        
        Klik link berikut untuk membuat password baru:
        {reset_link}
        
        PENTING:
        - Link reset ini hanya berlaku selama 1 jam
        - Link hanya bisa digunakan sekali  
        - Jika bukan kamu yang meminta reset, abaikan email ini
        
        Setelah reset password, kamu bisa kembali ngobrol dengan AI companion favoritmu!
        
        Jika kamu tidak meminta reset password, abaikan email ini.
        Password kamu akan tetap aman dan tidak berubah.
        
        Aku Kesepian - Your AI Companion 💕
        """
        
        return self.send_email(to_email, subject, html_content, text_content)