export default function requiredRule(val: any): boolean | string {
  return !!val || 'Небходимо ввести значение'
}
