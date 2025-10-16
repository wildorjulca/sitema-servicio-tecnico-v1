// router/emailRouter.ts
import express, { Request, Response } from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Configurar transporter de Nodemailer - CORREGIDO
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Endpoint para enviar reporte por email
router.post('/enviar-reporte', upload.single('pdf'), async (req: Request, res: Response) => {
  try {
    const { emailDestino, tipoPeriodo, fechaBase, asunto, mensaje } = req.body;
    
    if (!emailDestino) {
      res.status(400).json({ error: 'Email destino es requerido' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Archivo PDF es requerido' });
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailDestino,
      subject: asunto || `Reporte de Servicios - ${tipoPeriodo}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Reporte de Servicios Técnicos</h2>
          <p><strong>Periodo:</strong> ${tipoPeriodo}</p>
          <p><strong>Fecha Base:</strong> ${fechaBase}</p>
          <p>${mensaje || 'Adjunto encontrarás el reporte solicitado.'}</p>
          <br>
          <p style="color: #6b7280; font-size: 12px;">
            Este reporte fue generado automáticamente por el Sistema de Gestión de Servicios Técnicos.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: req.file.originalname || `reporte_${tipoPeriodo}.pdf`,
          path: req.file.path
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    // Limpiar archivo temporal
    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      message: 'Reporte enviado exitosamente' 
    });

  } catch (error) {
    console.error('Error enviando email:', error);
    
    // Limpiar archivo temporal en caso de error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: 'Error al enviar el reporte por email' 
    });
  }
});

// Endpoint de salud para verificar configuración de email
router.get('/config-email', (req: Request, res: Response) => {
  const config = {
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS,
    emailUser: process.env.EMAIL_USER ? 'Configurado' : 'No configurado'
  };
  
  res.json(config);
});

export const routerEmail = router;