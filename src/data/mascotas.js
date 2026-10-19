import robertoImg from "../assets/roberto.png";
import carlosImg from "../assets/carlos.png";
import cocoImg from "../assets/coco.png";

const repetir = (img, cantidad) => Array(cantidad).fill(img);

export const mascotasEjemplo = [
  {
    id: 1,
    nombre: "Roberto",
    dueno: "Martina",
    raza: "Bulldog francés",
    edad: "3 años",
    sexo: "Macho",
    peso: "12 kg",
    tamano: "Mediano",
    ubicacion: "Palermo, BsAs",
    telefono: "+54 11 5555-1234",
    fotos: repetir(robertoImg, 4),
    salud: { vacunas: true, desparasitacion: true, enfermedadesGeneticas: true, certificadoSalud: true },
  },
  {
    id: 2,
    nombre: "Carlos",
    dueno: "Julián",
    raza: "Golden Retriever",
    edad: "4 años",
    sexo: "Macho",
    peso: "32 kg",
    tamano: "Grande",
    ubicacion: "Palermo, BsAs",
    telefono: "+54 11 5555-5678",
    fotos: repetir(carlosImg, 8),
    salud: { vacunas: true, desparasitacion: true, enfermedadesGeneticas: true, certificadoSalud: true },
  },
  {
    id: 3,
    nombre: "Coco",
    dueno: "Sofía",
    raza: "Boyero de Berna",
    edad: "2 años",
    sexo: "Macho",
    peso: "20 kg",
    tamano: "Mediano",
    ubicacion: "Palermo, BsAs",
    telefono: "+54 11 5555-9012",
    fotos: repetir(cocoImg, 3),
    salud: { vacunas: true, desparasitacion: false, enfermedadesGeneticas: true, certificadoSalud: true },
  },
];