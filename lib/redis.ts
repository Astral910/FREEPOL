import { Redis } from '@upstash/redis'

/** Cliente global de Upstash Redis para antifraude y control de estado */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Guarda un valor en Redis con tiempo de expiración.
 * @param key   Clave de Redis
 * @param value Valor a guardar (string)
 * @param segundos Tiempo de vida en segundos
 */
export async function setConExpiracion(
  key: string,
  value: string,
  segundos: number,
): Promise<void> {
  await redis.set(key, value, { ex: segundos })
}

/**
 * Verifica si una clave existe en Redis.
 * Útil para antifraude: checar si un participante ya realizó una acción.
 */
export async function existe(key: string): Promise<boolean> {
  const resultado = await redis.exists(key)
  return resultado > 0
}

/**
 * Elimina una clave de Redis.
 * Se usa al completar operaciones atómicas para liberar el lock.
 */
export async function eliminar(key: string): Promise<void> {
  await redis.del(key)
}

/**
 * Intenta establecer un lock atómico (SET NX).
 * Devuelve true si el lock fue adquirido, false si ya existía.
 * Usado para prevenir condiciones de carrera en validación de códigos.
 */
export async function setNX(key: string, value: string, segundos: number): Promise<boolean> {
  const resultado = await redis.set(key, value, { nx: true, ex: segundos })
  return resultado === 'OK'
}
