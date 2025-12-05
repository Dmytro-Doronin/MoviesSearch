import {
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    BadGatewayException,
    ServiceUnavailableException,
    GatewayTimeoutException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';

interface TMDBError {
    status_message?: string;
    message?: string;
}

export function mapAxiosToHttp(err: unknown, source = 'Upstream'): never {
    const log = new Logger(`${source}Http`);
    const e = err as AxiosError<TMDBError>;

    const status = e.response?.status;
    const body = e.response?.data;
    const msg =
        (body?.status_message && true && body.status_message) ||
        (body?.message && true && body.message) ||
        `${source} error`;

    log.error(`${source} failed: ${e.message} (status=${status ?? 'none'})`);

    if (e.code === 'ECONNABORTED') throw new GatewayTimeoutException(`${source} timeout`);

    switch (status) {
        case 400:
            throw new BadRequestException(msg);
        case 401:
            throw new UnauthorizedException(`Invalid ${source} credentials`);
        case 403:
            throw new ForbiddenException(msg);
        case 404:
            throw new NotFoundException(`${source} resource not found`);
        case 500:
        case 502:
            throw new BadGatewayException(`${source} bad gateway`);
        case 503:
            throw new ServiceUnavailableException(`${source} unavailable`);
        case 504:
            throw new GatewayTimeoutException(`${source} gateway timeout`);
        default:
            throw new InternalServerErrorException(`Failed to fetch from ${source}`);
    }
}
