/**
 * TODO: this file will be removed after engagements list API is ready
 */
import {EtoolsPaginator} from '../../../common/layout/etools-table/pagination/paginator';

const ratings: string[] = ['Low', 'High', 'Medium'];
const statuses: string[] = ['Assigned', 'Submitted', 'Rejected'];
const assessors: string[] = ['John Doe', 'Jane Doe', 'Bruce Wayne'];
const randomValue = (myArray: string[]) => myArray[Math.floor(Math.random() * myArray.length)];

const listDataModel: any = {
  id: 1,
  ref_number: '2019/11',
  assessment_date: '2019-08-01',
  partner_name: 'Partner name',
  status: '',
  assessor: 'John Doe',
  rating: 'Low',
  rating_points: 23
};

let i = 0;
const data: any[] = [];
while (i < 150) {
  const item = {...listDataModel};
  item.id = item.id + i;
  item.assessor = randomValue(assessors);
  item.status = randomValue(statuses);
  item.rating = randomValue(ratings);
  item.partner_name = item.partner_name + ' ' + (i + 1);
  data.push(item);
  i++;
}

export const getListDummydata = (paginator: EtoolsPaginator) => {
  return new Promise((resolve, reject) => {
    try {
      const sliceStart = (paginator.page - 1) * paginator.page_size;
      const sliceEnd = paginator.page_size * paginator.page;
      const pageData = data.slice(sliceStart, sliceEnd);
      const paginatedData: any = {
        count: data.length,
        results: pageData
      };
      resolve(paginatedData);
    } catch (err) {
      reject(err);
    }
  });
};
