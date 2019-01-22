export class Index<T> {
    private collection: Array<any>;
    constructor(collection: Array<T>) {
        this.collection = collection.concat([]);
    }
    sum(sumFields: Array<string>, groupBy: Array<string> = []) {
        const groupByMap: any = {};
        const result: Array<any> = [];
        this.collection.forEach((row: any) => {
            let currentGroupBy: any = 'g';
            groupBy.forEach((gb: any) => {
                currentGroupBy += '-' + row[gb];
            });
            if (groupByMap[currentGroupBy] === undefined) {
                groupByMap[currentGroupBy] = result.length;
                let ob: any = {};
                sumFields.forEach((ok: any) => {
                    ob[ok] = 0;
                });
                groupBy.forEach((gb: any) => {
                    ob[gb] = row[gb];
                });
                result.push(ob);
            }
            sumFields.forEach((ok: any) => {
                result[groupByMap[currentGroupBy]][ok] = row[ok] + result[groupByMap[currentGroupBy]][ok];
            });

        });
        this.collection = result;
        return this;
    }

    avg(sumFields: Array<string>, groupBy: Array<string> = []) {
        const groupByMap: any = {};
        const result: Array<any> = [];
        this.collection.forEach((row: any) => {
            let currentGroupBy: any = 'g';
            groupBy.forEach((gb: any) => {
                currentGroupBy += '-' + row[gb];
            });
            if (groupByMap[currentGroupBy] === undefined) {
                groupByMap[currentGroupBy] = result.length;
                let ob: any = {};
                sumFields.forEach((ok: any) => {
                    ob[ok] = 0;
                    ob[ok + '____ccc'] = 0;
                });
                groupBy.forEach((gb: any) => {
                    ob[gb] = row[gb];
                });
                result.push(ob);
            }
            sumFields.forEach((ok: any) => {
                result[groupByMap[currentGroupBy]][ok] = row[ok] + result[groupByMap[currentGroupBy]][ok];
                if (row[ok] !== null) result[groupByMap[currentGroupBy]][ok + '____ccc'] ++;
            });
        });
        result.forEach((row: any) =>  {
            sumFields.forEach((ok: any) => {
                row[ok] = row[ok] / row[ok + '____ccc'];
                delete row[ok + '____ccc'];
            });
        });
        this.collection = result;
        return this;
    }

    count(groupBy: Array<string> = [], countField: string = 'count') {
        const groupByMap: any = {};
        const result: Array<any> = [];
        this.collection.forEach((row: any) => {
            let currentGroupBy: any = 'g';
            groupBy.forEach((gb: any) => {
                currentGroupBy += '-' + row[gb];
            });
            if (groupByMap[currentGroupBy] === undefined) {
                groupByMap[currentGroupBy] = result.length;
                let ob: any = {};
                ob[countField] = 0;
                groupBy.forEach((gb: any) => {
                    ob[gb] = row[gb];
                });
                result.push(ob);
            }
            result[groupByMap[currentGroupBy]][countField]++;
        });
        this.collection = result;
        return this;
    }

    join(collection: Array<any>) {
        let leftKeys = Object.keys(this.collection[0]);
        let rightKeys = Object.keys(collection[0]);
        leftKeys = leftKeys.filter((value: any) => -1 !== rightKeys.indexOf(value));
        const leftJonMap: any = {};
        collection.forEach((row: any) => {
            let currentKey: any = 'k-';
            leftKeys.forEach((key: string) => {
                currentKey += '|' + row[key];
            });
            if (leftJonMap[currentKey] === undefined) {
                leftJonMap[currentKey] = [];
            }
            leftJonMap[currentKey].push(row);
        });
        const newResult: any = [];
        this.collection.forEach((row: any) => {
            let currentKey: any = 'k-';
            leftKeys.forEach((key: string) => {
                currentKey += '|' + row[key];
            });
            leftJonMap[currentKey].forEach((rowMatch: any) => {
                newResult.push((<any>Object).assign({}, row, rowMatch));
            });
        });
        this.collection = newResult;
        return this;
    }

    calc(callback: any) {
        this.collection.forEach((row: any) => {
            row = callback(row);
        })
    }
    first(number: number) {
        this.collection = this.collection.slice(0, number);
        return this;
    }

    last(number: number) {
        this.collection = this.collection.slice(-number);
        return this;
    }

    union(collection: Array<any>) {
        this.collection = this.collection.concat(collection);
    }

    execute() {
        return this.collection.concat([]);
    }

    select(fields: Array<string>) {
        const newResult: any = [];
        this.collection.forEach((row: any) => {
           const newRow: any = {};
           for (let key in row) {
               if (fields.indexOf(key) >= 0) newRow[key] = row[key];
           }
           newResult.push(newRow);
        });
        this.collection = newResult;
        return this;
    }

    where(filter: Array<{field: string, operator: string, value: any}>) {
        const nr = this.collection.filter((row) => {
            let bol = true;
            filter.forEach((filterItem: {field: string, operator: string, value: any}) => {
                switch(filterItem.operator) {
                    case '=':
                        bol = (row[filterItem.field] === filterItem.value) && bol;
                }
            });
            return bol;
        });
        this.collection = nr;
        return this;
    }
}

