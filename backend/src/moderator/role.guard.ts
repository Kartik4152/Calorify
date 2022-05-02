import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ModeratorService } from './moderator.service';
@Injectable()
export class MRolesGuard implements CanActivate {
  constructor(private service: ModeratorService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // getting request object
    const request = context.switchToHttp().getRequest();
    // if user sending request is mod return true else return false
    return this.service.finduser(request.user.id).then((res) => {
      if (res.role === 'mod') {
        // if sending user object with role set to anything other than user or mod return false
        if (
          request.body.role &&
          request.body.role !== 'user' &&
          request.body.role !== 'mod'
        )
          return false;
        return true;
      }
      // if user is using api, return false
      return false;
    });
  }
}
