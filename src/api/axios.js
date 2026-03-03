import axios from "axios";

// On crée une "instance" d'axios configurée pour notre backend
// Toutes les requêtes utiliseront automatiquement cette URL de base
const api = axios.create({
  baseURL: "http://localhost:5000", // Adresse de ton backend Express
});

// "Intercepteur" : avant CHAQUE requête, on vérifie si l'utilisateur est connecté
// Si oui, on ajoute automatiquement son token dans le header Authorization
// C'est comme montrer sa carte d'accès à chaque porte
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;