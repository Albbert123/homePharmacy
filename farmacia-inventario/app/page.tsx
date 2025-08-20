'use client';

import { useEffect, useState } from 'react';

interface Farmaco {
  nombre: string;
  categoria: string;
  descripcion: string;
  fecha_caducidad: string;
  ubicacion: string;
  estado: string;
}

// Iconos por categoría base
const categoryIcons: { [key: string]: string } = {
  'Dermatología': '🧴',
  'Aftas': '👄',
  'Herpes': '🔥',
  'Antiinflamatorio': '💊',
  'Antifúngico': '🍄',
  'Analgésico': '🤒',
  'Aromaterapia': '🌸',
  'Antihistamínico': '🤧',
  'Antigripal': '🤒',
  'Bienestar': '🌿',
  'Alergias': '🤧'
};

// Colores por categoría base
const categoryColors: { [key: string]: string } = {
  'Dermatología': 'bg-blue-100 border-blue-300',
  'Aftas': 'bg-pink-100 border-pink-300',
  'Herpes': 'bg-red-100 border-red-300',
  'Antiinflamatorio': 'bg-green-100 border-green-300',
  'Antifúngico': 'bg-purple-100 border-purple-300',
  'Analgésico': 'bg-orange-100 border-orange-300',
  'Aromaterapia': 'bg-yellow-100 border-yellow-300',
  'Antihistamínico': 'bg-indigo-100 border-indigo-300',
  'Antigripal': 'bg-teal-100 border-teal-300',
  'Bienestar': 'bg-emerald-100 border-emerald-300',
  'Alergias': 'bg-rose-100 border-rose-300'
};

// Función para dividir categorías compuestas
const splitCategories = (categoria: string): string[] => {
  return categoria.split('/').map(cat => cat.trim());
};

export default function Home() {
  const [farmacos, setFarmacos] = useState<Farmaco[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFarmacos = async () => {
      try {
        const response = await fetch('/data/farmacos.json');
        const data = await response.json();
        setFarmacos(data.farmacos);
      } catch (error) {
        console.error('Error loading farmacos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmacos();
  }, []);

  // Obtener todas las categorías únicas (base)
  const allBaseCategories = Array.from(
    new Set(
      farmacos.flatMap(farmaco => 
        splitCategories(farmaco.categoria)
      )
    )
  ).sort();

  // Agrupar fármacos por categoría base
  const farmacosPorCategoria = allBaseCategories.reduce((acc, categoriaBase) => {
    acc[categoriaBase] = farmacos.filter(farmaco =>
      splitCategories(farmaco.categoria).includes(categoriaBase)
    );
    return acc;
  }, {} as { [key: string]: Farmaco[] });

  const toggleCategory = (categoria: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoria)) {
      newExpanded.delete(categoria);
    } else {
      newExpanded.add(categoria);
    }
    setExpandedCategories(newExpanded);
  };

  // Función para obtener todas las categorías de un producto
  const getProductCategories = (farmaco: Farmaco): string[] => {
    return splitCategories(farmaco.categoria);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-xl text-gray-700 animate-pulse">🔄 Cargando inventario...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏥 Inventario de Farmacia
          </h1>
          <p className="text-gray-600 text-lg">
            {farmacos.length} productos organizados en {allBaseCategories.length} categorías
          </p>
        </div>

        {/* Categorías */}
        <div className="space-y-6">
          {Object.entries(farmacosPorCategoria).map(([categoriaBase, productos]) => (
            <div key={categoriaBase} className={`rounded-2xl shadow-lg overflow-hidden ${
              categoryColors[categoriaBase] || 'bg-gray-100 border-gray-300'
            } border-2`}>
              
              {/* Header de categoría */}
              <button
                onClick={() => toggleCategory(categoriaBase)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-opacity-90 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{categoryIcons[categoriaBase] || '📦'}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{categoriaBase}</h2>
                    <p className="text-gray-600">{productos.length} producto{productos.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="text-2xl transform transition-transform">
                  {expandedCategories.has(categoriaBase) ? '▼' : '►'}
                </span>
              </button>

              {/* Productos de la categoría */}
              {expandedCategories.has(categoriaBase) && (
                <div className="bg-white p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productos.map((farmaco, index) => {
                      const productCategories = getProductCategories(farmaco);
                      
                      return (
                        <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300 border border-gray-200">
                          
                          {/* Header del producto */}
                          <div className="mb-4">
                            <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
                              {farmaco.nombre}
                            </h3>
                            
                            {/* Categorías del producto */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {productCategories.map((cat, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700"
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                farmaco.estado === 'En caja' 
                                  ? 'bg-green-100 text-green-800'
                                  : farmaco.estado === 'Suelto'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {farmaco.estado}
                              </span>
                              <span className="text-xs text-gray-500">
                                {farmaco.ubicacion}
                              </span>
                            </div>
                          </div>

                          {/* Descripción */}
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                            {farmaco.descripcion}
                          </p>

                          {/* Información adicional */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-700">
                              <span className="w-6">📅</span>
                              <span className="font-medium">
                                {new Date(farmaco.fecha_caducidad).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            
                            <div className="flex items-center text-gray-700">
                              <span className="w-6">📍</span>
                              <span className="font-medium">{farmaco.ubicacion}</span>
                            </div>
                          </div>

                          {/* Indicador de caducidad */}
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Caduca en:</span>
                              <span className="font-semibold text-green-600">
                                {Math.ceil((new Date(farmaco.fecha_caducidad).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} días
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="mt-10 p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Resumen del Inventario</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{farmacos.length}</div>
              <div className="text-sm text-blue-600">Total productos</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">
                {farmacos.filter(f => f.estado === 'En caja').length}
              </div>
              <div className="text-sm text-green-600">En caja</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-800">
                {farmacos.filter(f => f.estado === 'Suelto').length}
              </div>
              <div className="text-sm text-yellow-600">Sueltos</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-800">
                {allBaseCategories.length}
              </div>
              <div className="text-sm text-purple-600">Categorías base</div>
            </div>
          </div>
          
          {/* Lista de categorías */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3">🏷️ Categorías disponibles:</h4>
            <div className="flex flex-wrap gap-2">
              {allBaseCategories.map(categoria => (
                <span
                  key={categoria}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {categoria}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}