export const AIR_VISCOSITY = 1.81e-5;
export const OIL_DENSITY = 860;
export const AIR_DENSITY = 1.204;
export const GRAVITY = 9.81;
export const ELEMENTARY_CHARGE = 1.602176634e-19;
export const PLATE_SEPARATION = 5e-3;

export const MIN_DROP_RADIUS = 6e-7;
export const MAX_DROP_RADIUS = 1.1e-6;
export const MAX_EXCESS_ELECTRONS = 8;
export const MIN_BALANCE_VOLTAGE = 60;
export const MAX_BALANCE_VOLTAGE = 550;

const EFFECTIVE_DENSITY = OIL_DENSITY - AIR_DENSITY;

export function dropVolume(radius) {
  return (4 / 3) * Math.PI * radius ** 3;
}

export function dropMass(radius) {
  return dropVolume(radius) * OIL_DENSITY;
}

export function apparentWeight(radius) {
  return dropVolume(radius) * EFFECTIVE_DENSITY * GRAVITY;
}

export function dragCoefficient(radius) {
  return 6 * Math.PI * AIR_VISCOSITY * radius;
}

export function terminalFallSpeed(radius) {
  return apparentWeight(radius) / dragCoefficient(radius);
}

export function radiusFromFallSpeed(fallSpeed) {
  return Math.sqrt((9 * AIR_VISCOSITY * fallSpeed) / (2 * GRAVITY * EFFECTIVE_DENSITY));
}

export function electricField(voltage, plateSeparation = PLATE_SEPARATION) {
  return voltage / plateSeparation;
}

export function dropVelocity({ radius, charge, voltage, plateSeparation = PLATE_SEPARATION }) {
  const electricForce = charge * electricField(voltage, plateSeparation);
  return (electricForce - apparentWeight(radius)) / dragCoefficient(radius);
}

export function balanceVoltage({ radius, charge, plateSeparation = PLATE_SEPARATION }) {
  return (apparentWeight(radius) * plateSeparation) / charge;
}

export function chargeFromMeasurement({ fallSpeed, riseSpeed = 0, voltage, plateSeparation = PLATE_SEPARATION }) {
  const radius = radiusFromFallSpeed(fallSpeed);
  return (dragCoefficient(radius) * (fallSpeed + riseSpeed) * plateSeparation) / voltage;
}

export function chargeInElementaryUnits(charge) {
  return charge / ELEMENTARY_CHARGE;
}

export function nearestElectronCount(charge) {
  return Math.max(1, Math.round(chargeInElementaryUnits(charge)));
}

function balanceableElectronCounts(radius) {
  const chargeForFullScale = (apparentWeight(radius) * PLATE_SEPARATION) / ELEMENTARY_CHARGE;
  const fewest = Math.max(1, Math.ceil(chargeForFullScale / MAX_BALANCE_VOLTAGE));
  const most = Math.min(MAX_EXCESS_ELECTRONS, Math.floor(chargeForFullScale / MIN_BALANCE_VOLTAGE));
  return { fewest, most: Math.max(fewest, most) };
}

export const PRESET_DROPS = [
  { radius: 5.145e-7, excessElectrons: 1 },
  { radius: 7.582e-7, excessElectrons: 2 },
  { radius: 9.553e-7, excessElectrons: 3 },
  { radius: 8.837e-7, excessElectrons: 4 },
  { radius: 1.1994e-6, excessElectrons: 5 },
  { radius: 1.1373e-6, excessElectrons: 6 },
  { radius: 1.3054e-6, excessElectrons: 7 },
  { radius: 1.2965e-6, excessElectrons: 8 },
];

export function createPresetDrop(index) {
  const { radius, excessElectrons } = PRESET_DROPS[index];
  return { radius, excessElectrons, charge: excessElectrons * ELEMENTARY_CHARGE };
}

export function stokesConstant(fallSpeed) {
  return dragCoefficient(radiusFromFallSpeed(fallSpeed));
}

export function chargeFromFieldStrength({ fallSpeed, riseSpeed = 0, fieldStrength }) {
  return (stokesConstant(fallSpeed) * (fallSpeed + riseSpeed)) / fieldStrength;
}

export function createRandomDrop(random = Math.random) {
  const radius = MIN_DROP_RADIUS + random() * (MAX_DROP_RADIUS - MIN_DROP_RADIUS);
  const { fewest, most } = balanceableElectronCounts(radius);
  const excessElectrons = fewest + Math.floor(random() * (most - fewest + 1));
  return { radius, excessElectrons, charge: excessElectrons * ELEMENTARY_CHARGE };
}
