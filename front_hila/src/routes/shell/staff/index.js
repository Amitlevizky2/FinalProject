import { Staff } from './Staff';
import { UserType } from '../../../constants';

export default {
    path: "/staff",
    allowedUserTypes: [UserType.StaffMember, UserType.Admin, UserType.Administrators1],
    component: Staff,
    title: 'אנשי צוות'
};

