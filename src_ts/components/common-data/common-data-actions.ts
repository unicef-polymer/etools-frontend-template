import {EtoolsCommonData} from './common-data';
import './common-data';


const commonDataEl = document.createElement('etools-common-data') as EtoolsCommonData;

export const getUnicefUsersData = () => {
    return commonDataEl.getUnicefUserData();
};
