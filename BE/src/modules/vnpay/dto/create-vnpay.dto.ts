import { IsNotEmpty, IsOptional, Min } from "class-validator";

export class CreateVnpayDto {
    @IsNotEmpty({ message: 'amount không được để trống' })
    @Min(10000, { message: "amount cần tối thiểu là 10000" })
    amount: number;

    @IsOptional()
    bankCode: string;

    @IsNotEmpty({ message: 'locale không được để trống' })
    locale: string;

    @IsNotEmpty({ message: 'paymentRef không được để trống' })
    paymentRef: string;
}
