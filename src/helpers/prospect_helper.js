import _ from 'underscore';

/**
 * Most of these methods is (slightly adjusted) legacy from 2.0.s
 */
export const prospectHelper = {
    /**
     * Cleans values, converts objects inside button arrays to a single array.
     */
    _cleanValues: (obj) => {
        const loop = function loopF(obj) {
            _(obj).each((val, x) => {
                if (_.isArray(val) && val.length > 0) {
                    obj[x] = _(val).map((num) => {
                        if (typeof num.children === 'undefined') {
                            return {val: num.val};
                        }

                        const children = num.children;
                        loopF(children);
                        var obj = {val: num.val};
                        if (children) {
                            obj.children = children;
                        }

                        //Only keep val and children keys
                        return obj;
                    });
                } else if (_.isObject(val)) {
                    loopF(val);
                }
            });
        };

        loop(obj);
        return obj;
    },
    /**
     *  Returns all active values and removes unactive ones
     */
    getActiveValues: (obj) => {
        // Delete all values in loopDataSet that is not active
        return prospectHelper.loopDataSet(obj, false, (num, key, data) => {
            if (num.active === false) {
                return false;
            }
            return num;
        });
    },
    getSearchVariables: (query) => {
        let data;
        try {
            data = JSON.parse(JSON.stringify(query)); // Deep copy
        } catch (err) {
            console.error('Could not deep copy query');
            return {};
        }

        if (!data) {
            return {};
        }

        // Merge car and carExtra.
        data.car = _.extend(data.car, data.carExtra);
        delete data.carExtra;

        data = prospectHelper.getActiveValues(data);
        data = prospectHelper.removeProspectTypes(data);
        data = prospectHelper.removeEmptyValues(data);
        data = prospectHelper._cleanValues(data);

        return data;
    },
    loopDataSet: function loopDataSetF(data, insideArray, applyFunction) {
        if (typeof insideArray === 'undefined') {
            insideArray = false;
        }

        if (_.isObject(data)) {
            data = _.chain(data).map((num, key) => {
                if (_.isArray(num)) {
                    return [
                        key, loopDataSetF(num, true, applyFunction),
                    ]; // To work with _object
                } else if (insideArray) {
                    if (typeof applyFunction === 'function') {
                        num = applyFunction(num, key, data);
                    }

                    if (num && typeof num.children !== 'undefined') {
                        num.children = loopDataSetF(num.children, true, applyFunction);
                    }

                    return num;
                } else {
                    return [
                        key, loopDataSetF(num, false, applyFunction),
                    ]; // To work with _object
                }

            }).compact().value(); // Compact is so applyFunction can return a false value and delete them.
        }

        if (!insideArray && _.isObject(data)) {
            return _.object(data); // Make sure we return an object
        } else {
            return data;
        }
    },
    /**
     * Removes empty values from given object.
     */
    removeEmptyValues: (obj) => {
        // Remove empty arrays and objects here
        const loop = function loopF(obj) {
            _(obj).each((val, x) => {
                if (_.isArray(val) && val.length === 0) {
                    delete obj[x];
                } else if (_.isArray(val) && val.length > 0) {
                    obj[x] = _(val).map((num) => {
                        if (typeof num.children === 'undefined') {
                            return num;
                        }

                        const children = num.children;
                        loopF(children);
                        if (!children) {
                            delete num.children;
                        }

                        return num;
                    });
                } else if (_.isObject(val)) {
                    if (_.isEmpty(val)) {
                        delete obj[x];
                    } else if (typeof val.to !== 'undefined' && typeof val.from !== 'undefined' && val.to === null && val.from === null) {
                        // Range Object
                        delete obj[x];
                    } else {
                        loopF(val);
                    }
                }
            });

            // Loop a second time to remove empty objects at the top.
            _(obj).each((val, x) => {
                if (_.isObject(val) && _.isEmpty(val)) delete obj[x];
            });
        };

        loop(obj);
        return obj;
    },
    removeProspectTypes: (obj) => {
        if (obj && obj.prospectTypes) {
            var types = obj.prospectTypes;

            // The one and only special case
            if (!_.findWhere(types, {val: 'company'})) {
                delete obj.company;
            }

            if (!_.findWhere(types, {val: 'privatePerson'})) {
                delete obj.privatePerson;
            }
        }
        return obj;
    },
};
