import { Test, TestingModule } from '@nestjs/testing';
import { ResponseInterceptor } from '../response.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('ResponseInterceptor', () => {
  let itc: ResponseInterceptor<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    itc = module.get<ResponseInterceptor<any>>(ResponseInterceptor);
  });

  it('should be defined', () => {
    expect(new ResponseInterceptor()).toBeDefined();
  });

  it('you should transform the response by wrapping it in an object with success and data', (done) => {
    const mockContext = {} as ExecutionContext;

    const mockData = { id: 1, name: 'NestJS' };
    const mockCallHandler: CallHandler = {
      handle: () => of(mockData),
    };

    itc.intercept(mockContext, mockCallHandler).subscribe({
      next: (response) => {
        expect(response).toEqual({
          success: true,
          data: mockData,
        });
      },
      complete: () => {
        done();
      },
    });
  });
});
