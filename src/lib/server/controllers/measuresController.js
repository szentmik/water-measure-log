import { json } from '@sveltejs/kit'
import { measureServices } from '../services/measureServices'

const toNumberOrNull = (val) => {
  if (val == null || val === "") return null;
  const n = Number(val);
  if (!Number.isFinite(n)) throw new Error("Invalid numeric value");
  return n;
};

export const getAllMeasurements = async ({ url, locals }) => {

  const yearRaw = url.searchParams.get('year')
  const monthRaw = url.searchParams.get('month')
  const yearParam = yearRaw != null ? Number(yearRaw) : NaN
  const monthParam = monthRaw != null ? Number(monthRaw) : NaN
  const year = Number.isInteger(yearParam) ? yearParam : new Date().getFullYear()
  const month = Number.isInteger(monthParam) ? monthParam : new Date().getMonth() + 1

  if (month < 1 || month > 12) throw new Error('Invalid month');
  if (year < 1900 || year > 2100) throw new Error('Invalid year');

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
  const phValue = toNumberOrNull(body.phValue);
  const chlorValue = toNumberOrNull(body.chlorValue);
  const totalClValue = toNumberOrNull(body.totalClValue);
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

  const phValue = toNumberOrNull(body.sysPhValue);
  const chlorValue = toNumberOrNull(body.sysChlorValue);
  const redoxValue = toNumberOrNull(body.sysRedoxValue);
  const waterTemp = toNumberOrNull(body.sysWaterTemp);
  const flow = toNumberOrNull(body.sysFlow);
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
