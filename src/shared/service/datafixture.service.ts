import { Injectable } from "@nestjs/common";
import PermitReporitory from "src/modules/permit/repository/permit.repository";
import SubscriptionPlanReporitory from "src/modules/subscription/repository/subscription-plan.repository";
import UserReporitory from "src/modules/user/repository/user.repository";
import * as bcrypt from 'bcrypt';
import PaymentMethodReporitory from "src/modules/payment-method/repository/payment-method.repository";

@Injectable()
export class DataFixtureService {

    constructor(
        private readonly userRepository: UserReporitory,
        private readonly subscriptionRepository: SubscriptionPlanReporitory,
        private readonly permitRepository: PermitReporitory,
        private readonly paymentMethodRepository: PaymentMethodReporitory,
    ) {
        this.loadFixtures();
    }

    async loadFixtures() {
        const { superadmin,admin,user } = await this.loadPermitsFixtures() as any;
        const fixUser = await this.loadUsersFixtures(superadmin.id);
        const fixSubscriptionPlans = await this.loadSubscriptionPlansFixtures();
        const fixPaymentMethods = await this.loadPaymentMethodsFixtures();

        return { 
            subscription:{superadmin, admin, user}, 
            fixUser, 
            fixSubscriptionPlans,
            fixPaymentMethods
        };
    }

    async loadPermitsFixtures() {
        const superadmin = await this.permitRepository.upsert({
            create: {
                id: this.permitRepository.PermitSuperAdmin.name,
                name: this.permitRepository.PermitSuperAdmin.name,
                description: this.permitRepository.PermitSuperAdmin.description,
                list: this.permitRepository.PermitSuperAdmin.list,
            },
            update: {
                name: this.permitRepository.PermitSuperAdmin.name,
                description: this.permitRepository.PermitSuperAdmin.description,
                list: this.permitRepository.PermitSuperAdmin.list,
            },
            where: { id: this.permitRepository.PermitSuperAdmin.name },
        });

        const admin = await this.permitRepository.upsert({
            create: {
                id: this.permitRepository.PermitAdmin.name,
                name: this.permitRepository.PermitAdmin.name,
                description: this.permitRepository.PermitAdmin.description,
                list: this.permitRepository.PermitAdmin.list,
            },
            update: {
                name: this.permitRepository.PermitAdmin.name,
                description: this.permitRepository.PermitAdmin.description,
                list: this.permitRepository.PermitAdmin.list,
            },
            where: { id: this.permitRepository.PermitAdmin.name },
        });
        
        const user = await this.permitRepository.upsert({
            create: {
                id: this.permitRepository.PermitUser.name,
                name: this.permitRepository.PermitUser.name,
                description: this.permitRepository.PermitUser.description,
                list: this.permitRepository.PermitUser.list,
            },
            update: {
                name: this.permitRepository.PermitUser.name,
                description: this.permitRepository.PermitUser.description,
                list: this.permitRepository.PermitUser.list,
            },
            where: { id: this.permitRepository.PermitUser.name },
        });

        return { superadmin, admin, user };
    }

    async loadUsersFixtures(permitId: string) {
        const password = await bcrypt.hash("123456", 10);
        const user = await this.userRepository.upsert({
            where: { email: "superadmin@example.com" },
            create: {
                email: "superadmin@example.com",
                password,
                permits: { connect: { id: permitId } },
                username: "superadmin",
            },
            update: {
                email: "superadmin@example.com",
                username: "superadmin",
            },
        });

        return user;
    }

    async loadSubscriptionPlansFixtures() {
        const free = await this.subscriptionRepository.upsert({
            where: { id: "Free" },
            create: {
                id: "Free",
                name: "Free",
                description: "Free Subscription",
                price: 0,
                selected: false,
                content: [
                    'Wallet',
                ]
            },
            update: {
                name: "Free",
                description: "Free Subscription",
                price: 0,
                selected: false,
                content: [
                    'Wallet',
                ]
            },
        });

        const basic = await this.subscriptionRepository.upsert({
            where: { id: "Basic" },
            create: {
                id: "Basic",
                name: "Basic",
                description: "Basic Subscription",
                price: 14.99,
                content: [
                    'Wallet',
                ]
            },
            update: {
                name: "Basic",
                description: "Basic Subscription",
                price: 14.99,
                content: [
                    'Wallet',
                ]
            },
        });

        const premium = await this.subscriptionRepository.upsert({
            where: { id: "Premium" },
            create: {
                id: "Premium",
                name: "Premium",
                description: "Premium Subscription",
                price: 24.99,
                content: [
                    'Wallet',
                ]
            },
            update: {
                name: "Premium",
                description: "Premium Subscription",
                price: 24.99,
                content: [
                    'Wallet',
                ]
            },
        });

        return { free, basic, premium };
    }

    async loadPaymentMethodsFixtures() {
        const card = await this.paymentMethodRepository.upsert({
            where: { id: "Credit-Card" },
            create: {
                id: "Credit-Card",
                name: "Credit Card",
                description: "Credit Card",
                code: "CREDIT_CARD",
                active: false,
                colorStart: "3D3D3D",
                colorEnd: "555555",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/visa.png',

            },
            update: {
                name: "Credit Card",
                description: "Credit Card",
                code: "CREDIT_CARD",
                active: false,
                colorStart: "3D3D3D",
                colorEnd: "555555",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/visa.png',
            },
        });
        const paypal = await this.paymentMethodRepository.upsert({
            where: { id: "PayPal" },
            create: {
                id: "PayPal",
                name: "PayPal",
                description: "PayPal",
                code: "PAYPAL",
                active: false,
                colorStart: "003087",
                colorEnd: "009cde",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/paypal.png',
            },
            update: {
                name: "PayPal",
                description: "PayPal",
                code: "PAYPAL",
                active: false,
                colorStart: "003087",
                colorEnd: "009cde",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/paypal.png',
            },
        });
        const stripe = await this.paymentMethodRepository.upsert({
            where: { id: "Stripe" },
            create: {
                id: "Stripe",
                name: "Stripe",
                description: "Stripe",
                code: "STRIPE",
                active: false,
                colorStart: "635BFF",
                colorEnd: "6B7AFE",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/stripe.png',
            },
            update: {
                name: "Stripe",
                description: "Stripe",
                code: "STRIPE",
                active: false,
                colorStart: "635BFF",
                colorEnd: "6B7AFE",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/stripe.png',
            },
        });
        const crypto = await this.paymentMethodRepository.upsert({
            where: { id: "Crypto" },
            create: {
                id: "Binance",
                name: "Binance",
                description: "Binance",
                code: "BINANCE",
                active: false,
                colorStart: "1E2026",
                colorEnd: "2C2E35",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/binance.png',
            },
            update: {
                name: "Binance",
                description: "Binance",
                code: "BINANCE",
                active: false,
                colorStart: "1E2026",
                colorEnd: "2C2E35",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/binance.png',
            },
        });
        const mercadopago = await this.paymentMethodRepository.upsert({
            where: { id: "MercadoPago" },
            create: {
                id: "MercadoPago",
                name: "MercadoPago",
                description: "MercadoPago",
                code: "MercadoPago",
                active: false,
                colorStart: "009EE3",
                colorEnd: "00B2F6",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/mercadopago.png',
            },
            update: {
                name: "MercadoPago",
                description: "MercadoPago",
                code: "MercadoPago",
                active: false,
                colorStart: "009EE3",
                colorEnd: "00B2F6",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/mercadopago.png',
            },
        });
        const pagomovil = await this.paymentMethodRepository.upsert({
            where: { id: "PagoMobil" },
            create: {
                id: "PagoMobil",
                name: "PagoMobil",
                description: "PagoMobil",
                code: "PagoMobil",
                active: false,
                colorStart: "F7CA18",
                colorEnd: "F4B800",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/pagomovil.webp',
            },
            update: {
                name: "PagoMobil",
                description: "PagoMobil",
                code: "PagoMobil",
                active: false,
                colorStart: "F7CA18",
                colorEnd: "F4B800",
                colorText: 'FFFFFF',
                imagePath: '/public/images/payment-methods/pagomovil.webp',
            },
        });

        return { card, paypal, stripe, crypto, mercadopago, pagomovil };
    }

}
