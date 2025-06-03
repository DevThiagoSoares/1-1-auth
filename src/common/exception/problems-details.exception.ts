import { HttpException } from '@nestjs/common'

interface ProblemDetailsProps {
  type?: string
  title: string
  status: number
  detail?: string
  instance?: string
  extra?: Record<string, any>
}

export class ProblemDetailsException extends HttpException {
  constructor(props: ProblemDetailsProps) {
    const responseBody = {
      type: props.type || 'about:blank',
      title: props.title,
      status: props.status,
      detail: props.detail,
      instance: props.instance,
      ...props.extra,
    }
    super(responseBody, props.status)
  }
}
