import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AdminService } from './admin.service';
@Injectable()
export class ARolesGuard implements CanActivate {
  constructor(private service: AdminService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // getting request object
    const request = context.switchToHttp().getRequest();
    // check if user sending request is admin
    return this.service.findUser(request.user.id).then((res) => {
      if (res.role == 'admin') return true;
      return false;
    });
  }
}
