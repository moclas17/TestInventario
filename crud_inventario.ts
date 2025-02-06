/**
 * CRUD completo para un sistema de inventario utilizando la API de Nillion en TypeScript.
 *
 * Para ejecutar este archivo en modo desarrollo:
 *   npm run dev
 */

console.log("Iniciando CRUD de inventario...");

// Interfaces para tipar los datos

interface Producto {
    id: string;
    nombre: string;
    categoria: string;
    cantidad: number;
    precio: number;
    ubicacion: string;
  }
  
  interface ApiResponse {
    status: string;
    data?: any;
    [key: string]: any;
  }
  
  // Variables de configuración
  const NODE_ID: string = 'did:nil:testnet:nillion1wwsrjngxvu9tc335lj9k3mwwrrl5w3q2d0uetz';
  const BASE_URL: string = 'https://nildb-demo.nillion.network/'; // Endpoint base para la API
  const DATABASE: string = "inventarioDB";
  const COLLECTION: string = "productos";
  
  /**
   * Verifica que el nodo esté operativo.
   */
  async function verificarNodo(nodeId: string): Promise<boolean> {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");

        const requestOptionsok = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow" as RequestRedirect
        };
      const response = await fetch(`${BASE_URL}/about`, requestOptionsok);
      const data: ApiResponse = await response.json();
      console.log("Detalles del nodo:", data);
      if (data.status === 'operational') {  // Ejemplo de validación
        return true;
      } else {
        throw new Error("El nodo no está operativo");
      }
    } catch (error) {
      console.error("Error al verificar el nodo:", error);
      throw error;
    }
  }
  
  /**
   * Crea un nuevo producto en el inventario.
   */
  async function crearProducto(producto: Producto): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/insert-record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Agrega autenticación aquí si es necesario.
        },
        body: JSON.stringify({
          database: DATABASE,
          collection: COLLECTION,
          record: producto
        })
      });
      const data: ApiResponse = await response.json();
      console.log("Producto insertado:", data);
      return data;
    } catch (error) {
      console.error("Error al insertar el producto:", error);
      throw error;
    }
  }
  
  /**
   * Consulta un producto específico a partir de su ID.
   */
  async function obtenerProducto(productoId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/get-record?database=${DATABASE}&collection=${COLLECTION}&id=${productoId}`);
      const data: ApiResponse = await response.json();
      console.log("Producto obtenido:", data);
      return data;
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      throw error;
    }
  }
  
  /**
   * Consulta productos según un filtro o todos si no se especifica filtro.
   */
  async function consultarProductos(filtros: Record<string, any> = {}): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/query-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          database: DATABASE,
          collection: COLLECTION,
          query: filtros // Ejemplo: { categoria: "Electrónica" }
        })
      });
      const data: ApiResponse = await response.json();
      console.log("Productos consultados:", data);
      return data;
    } catch (error) {
      console.error("Error al consultar productos:", error);
      throw error;
    }
  }
  
  /**
   * Actualiza un producto existente a partir de su ID.
   */
  async function actualizarProducto(productoId: string, camposActualizados: Partial<Producto>): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/update-record`, {
        method: 'PUT', // O 'PATCH' según la implementación de la API
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          database: DATABASE,
          collection: COLLECTION,
          id: productoId,
          update: camposActualizados
        })
      });
      const data: ApiResponse = await response.json();
      console.log("Producto actualizado:", data);
      return data;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  }
  
  /**
   * Elimina un producto a partir de su ID.
   */
  async function eliminarProducto(productoId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/delete-record`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          database: DATABASE,
          collection: COLLECTION,
          id: productoId
        })
      });
      const data: ApiResponse = await response.json();
      console.log("Producto eliminado:", data);
      return data;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  }
  
  /**
   * Flujo completo CRUD:
   * 1. Verifica el nodo.
   * 2. Crea un nuevo producto.
   * 3. Consulta el producto insertado.
   * 4. Actualiza el producto.
   * 5. Consulta nuevamente el producto actualizado.
   * 6. Elimina el producto.
   */
  async function flujoCRUD(): Promise<void> {
    try {
      // 1. Verificar el estado del nodo
      await verificarNodo(NODE_ID);
      console.log("Nodo verificado y operativo.");
  
      // 2. Crear un nuevo producto
      const nuevoProducto: Producto = {
        id: "12345",
        nombre: "Producto A",
        categoria: "Electrónica",
        cantidad: 50,
        precio: 99.99,
        ubicacion: "Almacén 1"
      };
      await crearProducto(nuevoProducto);
  
      // 3. Consultar el producto insertado
      const productoConsultado = await obtenerProducto("12345");
      console.log("Producto consultado:", productoConsultado);
  
      // 4. Actualizar el producto (por ejemplo, cambiar cantidad y precio)
      const cambios: Partial<Producto> = { cantidad: 45, precio: 89.99 };
      await actualizarProducto("12345", cambios);
  
      // 5. Consultar nuevamente el producto actualizado
      const productoActualizado = await obtenerProducto("12345");
      console.log("Producto actualizado:", productoActualizado);
  
      // 6. Eliminar el producto
      await eliminarProducto("12345");
      console.log("Producto eliminado. Flujo CRUD completado exitosamente.");
  
    } catch (error) {
      console.error("Error en el flujo CRUD:", error);
    }
  }
  
  // Ejecutar el flujo CRUD completo
  flujoCRUD();
  