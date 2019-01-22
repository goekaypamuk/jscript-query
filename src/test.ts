import {JsQuery} from "./index";
console.log('executing ');
interface dataInterface {key: number;  value: number}

const testDataSet: Array<dataInterface> = [
    {key: 1, value: 5},
    {key: 1, value: 10},
    {key: 1, value: 15},
    {key: 2, value: 8},
    {key: 2, value: 12},
    {key: 2, value: 16}
    ];

const dataSet2: any = [
    {key: 1, name: 'key name 1'},
    {key: 2, name: 'key name 2'},
    {key: 3, name: 'key name 3'}
];

const jsQuery = new JsQuery<dataInterface>(testDataSet);

console.log(
    jsQuery
        .join(dataSet2)
        .avg(['value'], ['key'])
        .first(2)
        .where([{field: 'key', operator: '=', value: 1}])
        .execute()
);