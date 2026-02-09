import { json } from '@sveltejs/kit'
import { measureServices } from '../services/measureServices'

export const getAllMeasurements = async ({ url, locals }) => {

  const yearParam = Number(url.searchParams.get('year'))
  const monthParam = Number(url.searchParams.get('month'))
  const year = Number.isInteger(yearParam) ? yearParam : new Date().getFullYear()
  const month = Number.isInteger(monthParam) ? monthParam : new Date().getMonth() + 1

  if (month < 1 || month > 12) throw new Error('Invalid month')

  const userId = (await locals.auth())?.userId

  if (!userId) throw new Error('Unauthorized')

  return await measureServices.getComparisonDataByMonth(year, month)
}

export const getMeasurementsByUserId = async ({ locals }) => {

  const userId = (await locals.auth())?.userId

  if (!userId) throw new Error("Unauthorized");

  return await measureServices.getByUserId(userId)

}

export const addNewManualData = async ({ request, locals }) => {
  const userId = (await locals.auth())?.userId
  if (!userId) throw new Error("Unauthorized");


  const body = await request.json()
  const phValue = body.phValue != null ? Number(body.phValue) : null
  const chlorValue = body.chlorValue != null ? Number(body.chlorValue) : null
  const totalClValue = body.totalClValue != null ? Number(body.totalClValue) : null
  let gebClValue = null

  if (chlorValue !== null && totalClValue !== null) {
    gebClValue = Number((totalClValue - chlorValue).toFixed(2))
  }

  const data = {
    phValue,
    chlorValue,
    totalClValue,
    gebClValue
  }

  return await measureServices.upsertManual(data, userId)
}

export const addNewSystemData = async ({ request, locals }) => {

  const userId = (await locals.auth())?.userId
  if (!userId) throw new Error("Unauthorized");

  const body = await request.json()

  const phValue = body.sysPhValue != null ? Number(body.sysPhValue) : null
  const chlorValue = body.sysChlorValue != null ? Number(body.sysChlorValue) : null
  const redoxValue = body.sysRedoxValue != null ? Number(body.sysRedoxValue) : null
  const waterTemp = body.sysWaterTemp != null ? Number(body.sysWaterTemp) : null
  const flow = body.sysFlow != null ? Number(body.sysFlow) : null
  const filterBackwash =
    body.sysFilterBackwash === true || body.sysFilterBackwash === 'true'

  const data = {
    phValue,
    chlorValue,
    redoxValue,
    waterTemp,
    flow,
    filterBackwash,
    userId
  }

  return await measureServices.insertSystem(data)

}
