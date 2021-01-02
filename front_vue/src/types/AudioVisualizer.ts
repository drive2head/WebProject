
export interface AudioSection {
  start: number,
  end: number,
  value: string,
  description?: string,
  stress: Stress
}

export enum Stress {
  No = 'No',
  Primary = 'Primary',
  Secondary = 'Secondary'
}
