export const DEFAULT_DRIVER = {
  initials: 'SY',
  name: 'Suresh Yadav',
  designation: 'Fleet Driver #FT-9921',
  phone: '+91 98765 43210',
  email: 'suresh.yadav@fleettrack.com',
  vehicleModel: 'Tata Ace',
  vehicleNo: 'HR 26 AB 1234',
  owner: 'Rajesh Sharma',
  ownerPhone: '+91 99987 65432',
};

export type DriverProfile = typeof DEFAULT_DRIVER;

export const mergeDriverProfile = (user: Record<string, unknown> | null | undefined): DriverProfile => ({
  initials: (user?.initials as string) || DEFAULT_DRIVER.initials,
  name: (user?.name as string) || DEFAULT_DRIVER.name,
  designation: (user?.designation as string) || DEFAULT_DRIVER.designation,
  phone: (user?.phone as string) || DEFAULT_DRIVER.phone,
  email: (user?.email as string) || DEFAULT_DRIVER.email,
  vehicleModel: (user?.vehicleModel as string) || DEFAULT_DRIVER.vehicleModel,
  vehicleNo:
    (user?.vehicleNo as string) ||
    (user?.vehicle as string) ||
    DEFAULT_DRIVER.vehicleNo,
  owner: (user?.owner as string) || DEFAULT_DRIVER.owner,
  ownerPhone: (user?.ownerPhone as string) || DEFAULT_DRIVER.ownerPhone,
});
