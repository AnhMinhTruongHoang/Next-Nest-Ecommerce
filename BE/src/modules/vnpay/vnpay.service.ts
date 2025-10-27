import { Injectable } from '@nestjs/common';
import { CreateVnpayDto } from './dto/create-vnpay.dto';
import { UpdateVnpayDto } from './dto/update-vnpay.dto';
import { Request } from 'express';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import querystring from 'qs';

@Injectable()
export class VnpayService {
  constructor(private configService: ConfigService) {}

  sortObject(obj: any) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  createUrl(createVnpayDto: CreateVnpayDto, req: Request) {
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { amount, bankCode = '', locale = 'vn', paymentRef } = createVnpayDto;

    process.env.TZ = 'Asia/Ho_Chi_Minh';

    let date = new Date();
    let createDate = dayjs(date).format('YYYYMMDDHHmmss');
    let orderId = paymentRef;

    let tmnCode = this.configService.get<string>('vnp_TmnCode');
    let secretKey = this.configService.get<string>('vnp_HashSecret');
    let vnpUrl = this.configService.get<string>('vnp_Url');
    let returnUrl = this.configService.get<string>('vnp_ReturnUrl');

    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return {
      statusCode: 200,
      message: 'Create Vnpay URL',
      data: { url: vnpUrl },
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
    const secureHash = query['vnp_SecureHash'];
    delete query['vnp_SecureHash'];
    delete query['vnp_SecureHashType'];

    const secretKey = this.configService.get<string>('vnp_HashSecret');
    const sortedParams = this.sortObject(query);

    const signData = require('qs').stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return {
      isValid: secureHash === signed,
      data: query,
    };
  }
}
