import { Test, TestingModule } from '@nestjs/testing';
import { SalePaymentsController } from './sale-payments.controller';

describe('SalePaymentsController', () => {
  let controller: SalePaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalePaymentsController],
    }).compile();

    controller = module.get<SalePaymentsController>(SalePaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
