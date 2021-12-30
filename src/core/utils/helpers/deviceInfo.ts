export const getDeviceId = async (): Promise<string | null | undefined> => {
  try {
    const devices = await navigator?.mediaDevices?.enumerateDevices?.()
    const device = devices.find((device) => device.kind === 'videoinput')

    return device?.deviceId || device?.groupId
  } catch (error: any) {
    return null
  }
}
