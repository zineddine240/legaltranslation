import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ success: false, message: "Image manquante" }, { status: 400 });
    }

    // 1. Convertir le Base64 en fichier binaire
    // On enlève le préfixe "data:image/jpeg;base64," s'il est présent
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Création du Blob pour simuler un fichier
    const blob = new Blob([buffer], { type: "image/jpeg" });

    // 2. Préparer l'envoi
    const formData = new FormData();
    // IMPORTANT : "input" est le nom exact attendu par ton script Python (request.files['input'])
    formData.append("input", blob, "upload.jpg");

    // 3. Contacter le serveur Python (C'est ICI qu'on a changé l'adresse)
    // On utilise l'adresse de ton serveur Render
    const pythonServerUrl = "https://backend-ocr-7sm3.onrender.com/";

    // Note : J'ai ajouté un timeout de sécurité au cas où l'IA est lente
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes max

    const pythonResponse = await fetch(pythonServerUrl, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId); // On annule le timer si la réponse est arrivée

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json().catch(() => ({}));
      const messageDetail = errorData.error || pythonResponse.statusText;
      console.error("Erreur Python:", messageDetail);
      throw new Error(`Le serveur d'analyse a renvoyé une erreur : ${messageDetail}`);
    }

    const data = await pythonResponse.json();

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Erreur Next.js -> Python:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Erreur serveur interne" },
      { status: 500 }
    );
  }
}