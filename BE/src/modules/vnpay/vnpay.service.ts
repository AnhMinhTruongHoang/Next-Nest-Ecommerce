import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVnpayDto } from './dto/create-vnpay.dto';
import { UpdateVnpayDto } from './dto/update-vnpay.dto';
import { Request } from 'express';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import qs from 'qs';

@Injectable()
export class VnpayService {
  constructor(private configService: ConfigService) {}

  private getRequiredEnv(key: string) {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new BadRequestException(`Missing env: ${key}`);
    }

    return value;
  }

  private getClientIp(req: Request) {
    const forwardedFor = req.headers['x-forwarded-for'];

    if (typeof forwardedFor === 'string') {
      return forwardedFor.split(',')[0].trim();
    }

    if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
      return forwardedFor[0];
    }

    return (req.ip || req.socket.remoteAddress || '127.0.0.1').replace(
      '::ffff:',
      '',
    );
  }

  sortObject(obj: Record<string, any>) {
    const sorted: Record<string, string> = {};
    const keys = Object.keys(obj).sort();

    for (const key of keys) {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }

    return sorted;
  }

  createUrl(createVnpayDto: CreateVnpayDto, req: Request) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const { amount, bankCode = '', locale = 'vn', paymentRef } = createVnpayDto;

    if (!paymentRef) {
      throw new BadRequestException('Missing paymentRef');
    }

    const cleanAmount = Math.round(Number(amount));

    if (!Number.isFinite(cleanAmount) || cleanAmount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    const ipAddr = this.getClientIp(req);

    const createDate = dayjs(new Date()).format('YYYYMMDDHHmmss');
    const tmnCode = this.getRequiredEnv('vnp_TmnCode');
    const secretKey = this.getRequiredEnv('vnp_HashSecret');
    let vnpUrl = this.getRequiredEnv('vnp_Url');
    const returnUrl = this.getRequiredEnv('vnp_ReturnUrl');

    let vnpParams: Record<string, any> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale || 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: paymentRef,
      vnp_OrderInfo: `Thanh toan cho ma GD:${paymentRef}`,
      vnp_OrderType: 'other',
      vnp_Amount: cleanAmount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode;
    }

    vnpParams = this.sortObject(vnpParams);

    const signData = qs.stringify(vnpParams, { encode: false });
    const secureHash = crypto
      .createHmac('sha512', secretKey)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    vnpParams.vnp_SecureHash = secureHash;

    const paymentUrl = `${vnpUrl}?${qs.stringify(vnpParams, {
      encode: false,
    })}`;

    console.log('VNPAY CONFIG:', {
      tmnCode,
      returnUrl,
      vnpUrl,
      amount: cleanAmount,
      paymentRef,
      ipAddr,
    });

    console.log('VNPAY PAYMENT URL:', paymentUrl);

    return {
      statusCode: 200,
      message: 'Create Vnpay URL',
      data: { url: paymentUrl },
    };
  }

  findAll() {
    return `This action returns all vnpay`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vnpay`;
  }

  update(id: number, updateVnpayDto: UpdateVnpayDto) {
    return `This action updates a #${id} vnpay`;
  }

  remove(id: number) {
    return `This action removes a #${id} vnpay`;
  }

  verifyReturn(query: any) {
    const data = { ...query };

    const secureHash = data.vnp_SecureHash;
    delete data.vnp_SecureHash;
    delete data.vnp_SecureHashType;

    const secretKey = this.getRequiredEnv('vnp_HashSecret');
    const sortedParams = this.sortObject(data);

    const signData = qs.stringify(sortedParams, { encode: false });
    const signed = crypto
      .createHmac('sha512', secretKey)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    return {
      isValid: secureHash === signed,
      data,
    };
  }
}
