import robertoImg from "../assets/roberto.png";
import carlosImg from "../assets/carlos.png";
import cocoImg from "../assets/coco.png";

export const mascotasEjemplo = [
  {
    id: 1,
    nombre: "Roberto",
    raza: "Bulldog francés",
    edad: "3 años",
    sexo: "Macho",
    peso: "12 kg",
    tamano: "Mediano",
    ubicacion: "Palermo, BsAs",
    telefono: "+54 11 5555-1234",
    fotos: [
      robertoImg,
      "https://placehold.co/500x400/e8f3ea/2f5233?text=Roberto+2",
      "https://placehold.co/500x400/e8f3ea/2f5233?text=Roberto+3",
    ],
    salud: { vacunas: true, desparasitacion: true, enfermedadesGeneticas: true, certificadoSalud: true },
  },
  {
    id: 2,
    nombre: "Carlos",
    raza: "Golden Retriever",
    edad: "4 años",
    sexo: "Macho",
    peso: "32 kg",
    tamano: "Grande",
    ubicacion: "Palermo, BsAs",
    telefono: "+54 11 5555-5678",
    fotos: [
      carlosImg,
      "https://placehold.co/500x400/e8f3ea/2f5233?text=Carlos+2",
      "https://placehold.co/500x400/e8f3ea/2f5233?text=Carlos+3",
    ],
    salud: { vacunas: true, desparasitacion: true, enfermedadesGeneticas: true, certificadoSalud: true },
  },
  {
    id: 3,
    nombre: "Coco",
    raza: "Boyero de Berna",
    edad: "2 años",
    sexo: "Macho",
    peso: "20 kg",
    tamano: "Mediano",
    ubicacion: "Palermo, BsAs",
    telefono: "+54 11 5555-9012",
    fotos: [
      cocoImg,
      "https://placehold.co/500x400/e8f3ea/2f5233?text=Coco+2",
    ],
    salud: { vacunas: true, desparasitacion: false, enfermedadesGeneticas: true, certificadoSalud: true },
  },
];