import {store} from 'store';
import {request, tc} from 'helpers';
import {agileActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {addEntityToContacts} from 'store/contacts/tasks';

/**
 * Create a deal
 *
 * @param payload.cars
 * @param payload.contacts
 * @param payload.description
 * @param payload.files
 * @param payload.maturity
 * @param payload.prospects
 * @param payload.user_id
 */
export const createDeal = async (payload) => {
    try {
        const data = await request({
            data: {
                cars: payload.cars ? payload.cars : [],
                comments: '', // Deprecated property
                contacts: [], // Deprecated property
                description: payload.description ? payload.description : '',
                files: payload.files ? payload.files : [],
                maturity: payload.maturity ? payload.maturity : null,
                name: payload.name ? payload.name : null,
                phase: 'idle',
                prospects: payload.prospects ? payload.prospects : [],
                responsible: payload.responsible ? payload.responsible : null,
            },
            method: 'post',
            url: '/deals/',
        });

        if (!data || data instanceof Error) {
            showFlashMessage(tc.couldNotCreateDeal);
            console.error('Could not create deal:\n' + data);
        }

        // If contacts was provided, add deal id to these contacts.
        if (payload.contacts && payload.contacts.length && data._id) {
            await addEntityToContacts({
                contacts: payload.contacts,
                entityId: data._id,
                entityType: 'deal',
            })
        }

        return showFlashMessage(tc.dealWasCreated);
    } catch(err) {
        return console.error('Error in createDeal:\n' + err);
    }
};

/**
 * Get data for agile.
 * Check on set filters is done backend so no payload required.
 */
export const getAgile = async () => {
    try {
        /*
        const data = await request({
            method: 'get',
            url: '/agile/getAgile/',
        });


        if (data instanceof Error) {
            console.error('Error in getAgile:\n' + data);
        }
        */

        const data = mockData;

        let result: any = {
            deals: [],
            prospects: [],
        };

        if (data.deals && data.deals.length) {
            result.deals = data.deals;
        }

        if (data.prospects && data.prospects.data && data.prospects.data.length) {
            result.prospects = data.prospects.data;
        }

        return store.dispatch({ type: agileActionTypes.SET_AGILE_DATA, payload: result});
    } catch(err) {
        return console.error('Error in getAgile:\n' + err);
    }
};

const mockData = {
    "deals": [
        {
            "_id": "5ea9d1ea79cb6bc116652023",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Man, 33, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 21:13:46 GMT+0200 (Central European Summer Time)",
            "updated": "Tue Aug 11 2020 09:29:57 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "10979299"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "todo",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [
                {
                    "event_date": "Wed Aug 28 2020 09:00:00 GMT+0200 (Central European Summer Time)",
                    "action": "valuation",
                    "complete": false,
                    "_id": "74fe6510-dba4-11ea-bbe0-4b4859e3fdc8",
                    "comment": "En värdering",
                    "date_created": "2020-08-11T09:29:57+02:00"
                }
            ],
            "belongsToOther": false
        },
        {
            "_id": "5ea48344fb9f747c976c5000",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "Kvinna, 31, LINKÖPING",
            "maturity": "0",
            "created": "Sat Apr 25 2020 20:36:52 GMT+0200 (Central European Summer Time)",
            "updated": "Sat Apr 25 2020 20:37:03 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "8424720"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5eb13b1659640bf6f4799d03",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Kallskär AB",
            "maturity": "0",
            "created": "Tue May 05 2020 12:08:22 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Aug 19 2020 11:41:56 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "5568556020"
            ],
            "cars": [
                "ABC209",
                "ABC907"
            ],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "todo",
                "files": [
                    {
                        "s3_filename": "f8485af6-7df5-4e5a-a709-14d84bc5d6fe_logo_ettan.png",
                        "original_name": "logo_ettan.png"
                    }
                ],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": "",
            "events": [
                {
                    "event_date": "Wed Jul 08 2020 16:00:00 GMT+0200 (Central European Summer Time)",
                    "action": "meeting",
                    "complete": false,
                    "_id": "94e3f410-ba18-11ea-9e41-fbd68e1cac42",
                    "comment": "",
                    "date_created": "2020-06-29T16:55:32+02:00"
                },
                {
                    "event_date": "Mon Aug 24 2020 09:00:00 GMT+0200 (Central European Summer Time)",
                    "action": "analysis",
                    "complete": false,
                    "_id": "d006fda0-dba4-11ea-bbe0-4b4859e3fdc8",
                    "comment": "Behovsanalys hos Kallskär",
                    "date_created": "2020-08-11T09:32:29+02:00"
                }
            ],
            "belongsToOther": false
        },
        {
            "_id": "5ea48350fb9f747c976c5003",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Man, 63, LINKÖPING",
            "maturity": "0",
            "created": "Sat Apr 25 2020 20:37:04 GMT+0200 (Central European Summer Time)",
            "updated": "Sat Apr 25 2020 20:37:26 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "4143303"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea48431fb9f747c976c5005",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "negotiation",
            "name": "Man, 67, LINKÖPING",
            "maturity": "0",
            "created": "Sat Apr 25 2020 20:40:49 GMT+0200 (Central European Summer Time)",
            "updated": "Sat Apr 25 2020 20:41:01 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "3528782"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea6934757614a8a3242efa2",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "Kvinna, 63, LINKÖPING",
            "maturity": "0",
            "created": "Mon Apr 27 2020 10:09:43 GMT+0200 (Central European Summer Time)",
            "updated": "Mon Apr 27 2020 10:09:59 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "4158781"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea6935a57614a8a3242efa4",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Bilvaruhuset i Höör Aktiebolag",
            "maturity": "0",
            "created": "Mon Apr 27 2020 10:10:02 GMT+0200 (Central European Summer Time)",
            "updated": "Mon Jun 29 2020 10:14:36 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "5561177022",
                "5561636951",
                "5560763186",
                "5592288517"
            ],
            "cars": [
                "ABF088",
                "ABF412",
                "ABF881"
            ],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "todo",
                "files": [
                    {
                        "s3_filename": "3f9a73ab-38e2-4383-a634-e9313abace85_bilprospekt_1584536880541_7187.xlsx",
                        "original_name": "bilprospekt_1584536880541_7187.xlsx"
                    },
                    {
                        "s3_filename": "614b67f4-f803-4cb0-822f-74c6f1609ea3_bilprospekt_1582713446448_3276.xlsx",
                        "original_name": "bilprospekt_1582713446448_3276.xlsx"
                    }
                ],
                "include_default_contact": false
            },
            "description": "",
            "potential": "",
            "comments": null,
            "events": [],
            "prev_user_id": 8392,
            "belongsToOther": false
        },
        {
            "_id": "5ea6935e57614a8a3242efa5",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "negotiation",
            "name": "Man, 73, LINKÖPING",
            "maturity": "0",
            "created": "Mon Apr 27 2020 10:10:06 GMT+0200 (Central European Summer Time)",
            "updated": "Mon Apr 27 2020 10:10:19 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "2849885"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea98dae085c6bbfa842e860",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Peters super-affär",
            "maturity": 4,
            "created": "Wed Apr 29 2020 16:22:38 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Jun 10 2020 12:01:31 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "5566524301"
            ],
            "cars": [
                "ABC157",
                "ABC910",
                "REF356",
                "REF778",
                "RET801",
                "RUD176",
                "RUT00Y",
                "RUT182",
                "RUZ154"
            ],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "todo",
                "files": [],
                "include_default_contact": false
            },
            "description": "",
            "potential": "",
            "comments": null,
            "events": [],
            "contacts": [
                {
                    "_id": "58c67343a7b8b8e52633e444",
                    "name": "Karin Johansson",
                    "comment": "Ekonomiansvarig",
                    "userId": 8392,
                    "dealerId": 5141,
                    "savedTo": [
                        {
                            "entityType": "company",
                            "entityId": "2120001744",
                            "companyId": "2120001744"
                        },
                        {
                            "entityId": "5ea98dae085c6bbfa842e860"
                        }
                    ],
                    "tele": [
                        ""
                    ],
                    "email": [
                        "karin.johansson@falkoping.se"
                    ],
                    "__v": 0,
                    "updated": "2020-05-12T07:50:57.797Z"
                }
            ],
            "files": null,
            "prev_user_id": 8392,
            "belongsToOther": false,
            "colleagueDeals": [
                {
                    "user_id": 7304,
                    "name": "Emil Johansson",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7142,
                    "name": "Simon NIls Adrell",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7153,
                    "name": "Patrik Forslund",
                    "phase": "Vunnen"
                },
                {
                    "user_id": 7415,
                    "name": "James",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak",
                    "phase": "Förlorad"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 8546,
                    "name": "Marcus Wigren",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7139,
                    "name": "Björn Ekström",
                    "phase": "Prospekt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak Larsson",
                    "phase": "Prospekt"
                }
            ]
        },
        {
            "_id": "5ea98dbb085c6bbfa842e863",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Man, 42, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 16:22:51 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 16:23:14 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "6693459"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea98ecc79cb6bc116652001",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "Man, 36, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 16:27:24 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 16:27:41 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "7631162"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false,
            "ownActiveDeals": [
                {
                    "listName": "Mitt nya grymma listnamn",
                    "phase": "I kontakt"
                }
            ]
        },
        {
            "_id": "5ea98ee079cb6bc116652003",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Ej angivet, 2020, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 16:27:44 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 16:27:57 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "5468547"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea98eef79cb6bc116652005",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Man, 56, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 16:27:59 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 16:28:08 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "4925437"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea98f0579cb6bc116652007",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "Man, 68, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 16:28:21 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 16:28:28 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "3443463"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea98f0e79cb6bc116652009",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "BJÖRKMAN, ARNE",
            "maturity": "0",
            "created": "Wed Apr 29 2020 16:28:30 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 16:28:36 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "1715834"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea9930179cb6bc11665200b",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Man, 75, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 16:45:21 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 16:45:27 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "2506336"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea9930979cb6bc11665200d",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Kvinna, 54, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 16:45:29 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 16:45:34 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "7695589"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea9931079cb6bc11665200f",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "negotiation",
            "name": "Man, 35, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 16:45:36 GMT+0200 (Central European Summer Time)",
            "updated": "Thu Apr 30 2020 18:39:31 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "10860839"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "contacted",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea9cf0d79cb6bc116652014",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "negotiation",
            "name": "Man, 69, UDDEVALLA",
            "maturity": "0",
            "created": "Wed Apr 29 2020 21:01:33 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 21:01:52 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "3284425"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea9cf1479cb6bc116652015",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "Man, 48, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 21:01:40 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 21:01:45 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "6097065"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea9cf2179cb6bc116652018",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Man, 30, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 21:01:53 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 21:01:58 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "8895738"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea9cf2979cb6bc11665201a",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "negotiation",
            "name": "Kvinna, 59, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 21:02:01 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 21:02:09 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "4624483"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea9d1e579cb6bc116652021",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "Testar igen 2",
            "maturity": "0",
            "created": "Wed Apr 29 2020 21:13:41 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Apr 29 2020 21:13:45 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "7972229"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ea9d1f279cb6bc116652025",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "negotiation",
            "name": "Man, 74, LINKÖPING",
            "maturity": "0",
            "created": "Wed Apr 29 2020 21:13:54 GMT+0200 (Central European Summer Time)",
            "updated": "Tue Aug 11 2020 09:30:11 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "2605282"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "contacted",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [
                {
                    "event_date": "Thu Sep 01 2020 09:00:00 GMT+0200 (Central European Summer Time)",
                    "action": "testride",
                    "complete": false,
                    "_id": "7dd12740-dba4-11ea-bbe0-4b4859e3fdc8",
                    "comment": "Provkör några mil",
                    "date_created": "2020-08-11T09:30:12+02:00"
                }
            ],
            "belongsToOther": false
        },
        {
            "_id": "5eaab121035170c7de3c041d",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Kvinna, 69, LINKÖPING",
            "maturity": "0",
            "created": "Thu Apr 30 2020 13:06:09 GMT+0200 (Central European Summer Time)",
            "updated": "Tue May 05 2020 12:07:50 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "3335162"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "todo",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [
                {
                    "event_date": "Fri Sep 04 2020 21:00:00 GMT+0200 (Central European Summer Time)",
                    "action": "valuation",
                    "complete": false,
                    "_id": "8f6e9ba0-ba42-11ea-a92b-f9d012d4de72",
                    "comment": "",
                    "date_created": "2020-06-29T21:56:02+02:00"
                }
            ],
            "belongsToOther": false
        },
        {
            "_id": "5eaab129035170c7de3c0420",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Man, 27, LINKÖPING",
            "maturity": 4,
            "created": "Thu Apr 30 2020 13:06:17 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Jun 24 2020 11:46:18 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "9135278",
                "5566524301"
            ],
            "cars": [
                "ABF455",
                "ABF456"
            ],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "todo",
                "files": [
                    {
                        "s3_filename": "df0614d0-1872-4971-b75e-67cb0d00aef4_bilprospekt_1584536249767_1714.xlsx",
                        "original_name": "bilprospekt_1584536249767_1714.xlsx"
                    },
                    {
                        "s3_filename": "42cea6bf-5c4f-4cec-b108-bcf5d5fcd01b_bilprospekt_1584536244498_6925.xlsx",
                        "original_name": "bilprospekt_1584536244498_6925.xlsx"
                    },
                    {
                        "s3_filename": "8e2b5990-780c-42c8-8b18-fa904834ccf5_bilprospekt_1584536249767_1714.xlsx",
                        "original_name": "bilprospekt_1584536249767_1714.xlsx"
                    }
                ],
                "include_default_contact": false
            },
            "description": "Beskrivning",
            "potential": "5 fordon",
            "comments": null,
            "events": [],
            "prev_user_id": 8392,
            "belongsToOther": false
        },
        {
            "_id": "5eaab133035170c7de3c0423",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Man, 29, LINKÖPING",
            "maturity": "0",
            "created": "Thu Apr 30 2020 13:06:27 GMT+0200 (Central European Summer Time)",
            "updated": "Thu Apr 30 2020 13:06:34 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "8805458"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5eaaff34035170c7de3c0428",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": [
                "Kvinna, 33, LINKÖPING"
            ],
            "maturity": "0",
            "created": "Thu Apr 30 2020 18:39:16 GMT+0200 (Central European Summer Time)",
            "updated": "Mon May 11 2020 16:48:45 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "8070064"
            ],
            "cars": [
                "AAG338"
            ],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159c",
                "moved_from_phase": "todo",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5eb002f22e2335ec2ff9a608",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "Man, 75, LINKÖPING",
            "maturity": "0",
            "created": "Mon May 04 2020 13:56:34 GMT+0200 (Central European Summer Time)",
            "updated": "Thu May 07 2020 18:56:45 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "null",
                "null"
            ],
            "cars": [
                "AAG32C"
            ],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": "",
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5eb00a632e2335ec2ff9a60d",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "Kvinna, 68, LINKÖPING",
            "maturity": "0",
            "created": "Mon May 04 2020 14:28:19 GMT+0200 (Central European Summer Time)",
            "updated": "Thu May 07 2020 18:56:35 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "3431149"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": "",
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5eb00a632e2335ec2ff9a60e",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "Kvinna, 68, LINKÖPING",
            "maturity": "0",
            "created": "Mon May 04 2020 14:28:19 GMT+0200 (Central European Summer Time)",
            "updated": "Tue May 19 2020 21:56:34 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "3431149"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [
                    {
                        "s3_filename": "4803cbb5-1191-4190-9ec8-7dc02808c95a_preview3.pdf",
                        "original_name": "preview (3).pdf"
                    },
                    {
                        "s3_filename": "c2262255-4d19-4ad2-b4b6-8e6ca2487c91_align-justify.svg",
                        "original_name": "align-justify.svg"
                    }
                ],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": "",
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ec27703201cae085fe0e457",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "contacted",
            "name": "Peteraffär 1",
            "maturity": "0",
            "created": "Mon May 18 2020 13:52:35 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Aug 19 2020 10:50:10 GMT+0200 (Central European Summer Time)",
            "prospects": [],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "todo",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": "",
            "events": [
                {
                    "event_date": "Thu Aug 20 2020 10:00:00 GMT+0200 (Central European Summer Time)",
                    "action": "valuation",
                    "complete": false,
                    "_id": "fd1aea40-e1f8-11ea-8726-9f02350791a2",
                    "comment": "sdasdadad",
                    "date_created": "2020-08-19T10:50:10+02:00"
                }
            ],
            "belongsToOther": false
        },
        {
            "_id": "5ed0f1cf5c9db28d4e1c622f",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "testaffär bv",
            "maturity": "0",
            "created": "Fri May 29 2020 13:28:15 GMT+0200 (Central European Summer Time)",
            "updated": "Fri May 29 2020 13:28:40 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "5566524301"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": true
            },
            "description": null,
            "potential": null,
            "comments": "",
            "events": [],
            "belongsToOther": false,
            "ownActiveDeals": [
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                },
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                }
            ],
            "colleagueDeals": [
                {
                    "user_id": 7304,
                    "name": "Emil Johansson",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7142,
                    "name": "Simon NIls Adrell",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7153,
                    "name": "Patrik Forslund",
                    "phase": "Vunnen"
                },
                {
                    "user_id": 7415,
                    "name": "James",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak",
                    "phase": "Förlorad"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 8546,
                    "name": "Marcus Wigren",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7139,
                    "name": "Björn Ekström",
                    "phase": "Prospekt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak Larsson",
                    "phase": "Prospekt"
                }
            ]
        },
        {
            "_id": "5ede3d4d9e87bff509a07936",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "idle",
            "name": "hej",
            "maturity": "0",
            "created": "Mon Jun 08 2020 15:29:49 GMT+0200 (Central European Summer Time)",
            "updated": "Mon Jun 08 2020 15:30:20 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "5566524301"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": true
            },
            "description": null,
            "potential": null,
            "comments": "",
            "events": [],
            "belongsToOther": false,
            "ownActiveDeals": [
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                },
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                }
            ],
            "colleagueDeals": [
                {
                    "user_id": 7304,
                    "name": "Emil Johansson",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7142,
                    "name": "Simon NIls Adrell",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7153,
                    "name": "Patrik Forslund",
                    "phase": "Vunnen"
                },
                {
                    "user_id": 7415,
                    "name": "James",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak",
                    "phase": "Förlorad"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 8546,
                    "name": "Marcus Wigren",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7139,
                    "name": "Björn Ekström",
                    "phase": "Prospekt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak Larsson",
                    "phase": "Prospekt"
                }
            ]
        },
        {
            "_id": "5ee0a4940c8a2b07cd119e33",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "idle",
            "name": "Namnet",
            "maturity": 3,
            "created": "Wed Jun 10 2020 11:15:00 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Jun 10 2020 11:15:00 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "5566524301"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": true
            },
            "description": "Beskrivning av aggär",
            "potential": null,
            "comments": "",
            "events": [],
            "belongsToOther": false,
            "ownActiveDeals": [
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                },
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                }
            ],
            "colleagueDeals": [
                {
                    "user_id": 7304,
                    "name": "Emil Johansson",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7142,
                    "name": "Simon NIls Adrell",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7153,
                    "name": "Patrik Forslund",
                    "phase": "Vunnen"
                },
                {
                    "user_id": 7415,
                    "name": "James",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak",
                    "phase": "Förlorad"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 8546,
                    "name": "Marcus Wigren",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7139,
                    "name": "Björn Ekström",
                    "phase": "Prospekt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak Larsson",
                    "phase": "Prospekt"
                }
            ]
        },
        {
            "_id": "5ee0a5ef0c8a2b07cd119e34",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "idle",
            "name": "Bilvision AB",
            "maturity": "0",
            "created": "Wed Jun 10 2020 11:20:47 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Jun 10 2020 11:20:47 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "5566524301"
            ],
            "cars": [
                "AAG595"
            ],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": true
            },
            "description": null,
            "potential": null,
            "comments": "",
            "events": [],
            "belongsToOther": false,
            "ownActiveDeals": [
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                },
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                }
            ],
            "colleagueDeals": [
                {
                    "user_id": 7304,
                    "name": "Emil Johansson",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7142,
                    "name": "Simon NIls Adrell",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7153,
                    "name": "Patrik Forslund",
                    "phase": "Vunnen"
                },
                {
                    "user_id": 7415,
                    "name": "James",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak",
                    "phase": "Förlorad"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 8546,
                    "name": "Marcus Wigren",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7139,
                    "name": "Björn Ekström",
                    "phase": "Prospekt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak Larsson",
                    "phase": "Prospekt"
                }
            ]
        },
        {
            "_id": "5ee3502a54e9c521d0ea5969",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "idle",
            "name": "ref267",
            "maturity": "0",
            "created": "Fri Jun 12 2020 11:51:38 GMT+0200 (Central European Summer Time)",
            "updated": "Fri Jun 12 2020 11:51:38 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "5566524301",
                "REF267",
                "9281859"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": "",
            "potential": null,
            "comments": "",
            "events": [],
            "belongsToOther": false,
            "ownActiveDeals": [
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                },
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                }
            ],
            "colleagueDeals": [
                {
                    "user_id": 7304,
                    "name": "Emil Johansson",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7142,
                    "name": "Simon NIls Adrell",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7153,
                    "name": "Patrik Forslund",
                    "phase": "Vunnen"
                },
                {
                    "user_id": 7415,
                    "name": "James",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak",
                    "phase": "Förlorad"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 8546,
                    "name": "Marcus Wigren",
                    "phase": "I kontakt"
                },
                {
                    "user_id": 7305,
                    "name": "Ludvig Åstrand",
                    "phase": "Ta bort"
                },
                {
                    "user_id": 7139,
                    "name": "Björn Ekström",
                    "phase": "Prospekt"
                },
                {
                    "user_id": 7946,
                    "name": "Isak Larsson",
                    "phase": "Prospekt"
                }
            ]
        },
        {
            "_id": "5eee294f49ee267820869c35",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "EttNamn",
            "maturity": "0",
            "created": "Sat Jun 20 2020 17:20:47 GMT+0200 (Central European Summer Time)",
            "updated": "Sat Jun 20 2020 17:21:01 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "9281859"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": "",
            "events": [],
            "belongsToOther": false
        },
        {
            "_id": "5ef31b067e9cdb197b2796ea",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "idle",
            "name": "Ny affär",
            "maturity": 2,
            "created": "Wed Jun 24 2020 11:21:10 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Jun 24 2020 11:21:10 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "5561636951"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [
                    {
                        "s3_filename": "c511bd15-dcdf-4a2e-a320-8abf299a7845_bilprospekt_1584536880541_7187.xlsx",
                        "original_name": "bilprospekt_1584536880541_7187.xlsx"
                    }
                ],
                "include_default_contact": false
            },
            "description": "Sälja lite bil",
            "potential": null,
            "comments": "",
            "events": [],
            "belongsToOther": false,
            "ownActiveDeals": [
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                }
            ]
        },
        {
            "_id": "5ef321847e9cdb197b2796f0",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "idle",
            "name": "Ny affär för Johan och Bilvision",
            "maturity": 3,
            "created": "Wed Jun 24 2020 11:48:52 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Jun 24 2020 11:48:52 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "9135278",
                "5566524301"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": null,
                "moved_from_phase": "idle",
                "files": [
                    {
                        "s3_filename": "af9b73b7-8bbb-4fcb-8dae-97de2b8c2151_bilprospekt_1584536249767_1714.xlsx",
                        "original_name": "bilprospekt_1584536249767_1714.xlsx"
                    }
                ],
                "include_default_contact": false
            },
            "description": "Beskrivning",
            "potential": null,
            "comments": "",
            "events": [
                {
                    "event_date": "Fri Aug 28 2020 10:00:00 GMT+0200 (Central European Summer Time)",
                    "action": "valuation",
                    "complete": false,
                    "_id": "a9b43c60-e1f5-11ea-8726-9f02350791a2",
                    "comment": "fgdfgdfgdfg",
                    "date_created": "2020-08-19T10:26:21+02:00"
                }
            ],
            "belongsToOther": false,
            "ownActiveDeals": [
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                },
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                },
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "Behov undersöks"
                }
            ]
        },
        {
            "_id": "5f3cec4190285b1cb62beb6f",
            "user_id": 8392,
            "dealer_id": 5141,
            "userName": "Peter Persson",
            "userEmail": "peter.persson@bilvision.se",
            "phase": "todo",
            "name": "Man, 36, LINKÖPING",
            "maturity": "0",
            "created": "Wed Aug 19 2020 11:09:21 GMT+0200 (Central European Summer Time)",
            "updated": "Wed Aug 19 2020 11:09:27 GMT+0200 (Central European Summer Time)",
            "prospects": [
                "7631162"
            ],
            "cars": [],
            "meta": {
                "moved_by": {
                    "id": 8392,
                    "name": "Peter Persson"
                },
                "moved_from_list": "5f3be7b306e7b01a0d45159a",
                "moved_from_phase": "idle",
                "files": [],
                "include_default_contact": false
            },
            "description": null,
            "potential": null,
            "comments": null,
            "events": [],
            "belongsToOther": false,
            "ownActiveDeals": [
                {
                    "listName": "KIA i Östergötland - Linköpings Berga 2",
                    "phase": "I kontakt"
                }
            ]
        }
    ],
    "prospects": {
        "data": [
            {
                "name": "Man, 33, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 8118653
            },
            {
                "name": "Kvinna, 31, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 8424720,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "I kontakt"
                    }
                ]
            },
            {
                "name": "Man, 63, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 4143303,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Man, 42, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 6693459,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Man, 75, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2585109
            },
            {
                "name": "Man, 67, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 3528782,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Under förhandling"
                    }
                ]
            },
            {
                "name": "Kvinna, 63, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 4158781,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "I kontakt"
                    }
                ]
            },
            {
                "name": "Man, 73, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2849885,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Under förhandling"
                    }
                ]
            },
            {
                "name": "Kvinna, 68, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 3431149
            },
            {
                "name": "Man, 48, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 6097065,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "I kontakt"
                    }
                ]
            },
            {
                "name": "Man, 76, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2360552
            },
            {
                "name": "Ej angivet, 2020, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5468547,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Kvinna, 59, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 4624483,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Under förhandling"
                    }
                ]
            },
            {
                "name": "Man, 30, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 8895738,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Testar igen 2",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 7972229,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "I kontakt"
                    }
                ]
            },
            {
                "name": "Man, 69, UDDEVALLA",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 3284425,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Under förhandling"
                    }
                ]
            },
            {
                "name": "Man, 56, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 4925437,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Man, 68, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 3443463,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "I kontakt"
                    }
                ]
            },
            {
                "name": "Man, 75, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2506336,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "BJÖRKMAN, ARNE",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 1715834,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Man, 74, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2605282,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Under förhandling"
                    }
                ]
            },
            {
                "name": "Kvinna, 54, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 7695589,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Man, 35, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 10860839,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Under förhandling"
                    }
                ]
            },
            {
                "name": "Man, 33, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 10979299,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Kvinna, 69, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 3335162,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Man, 28, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 9875415
            },
            {
                "name": "Man, 29, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 8805458,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Johan Anderssonnnn",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 9135278,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Kvinna, 33, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 8070064,
                "ownActiveDeals": [
                    {
                        "listName": "KIA i Östergötland - Linköpings Berga 2",
                        "phase": "Behov undersöks"
                    }
                ]
            },
            {
                "name": "Kvinna, 67, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 3461034
            },
            {
                "name": "Man, 62, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 4280907
            },
            {
                "name": "Man, 56, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5033102
            },
            {
                "name": "Man, 36, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 9086355
            },
            {
                "name": "Man, 47, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 6115981
            },
            {
                "name": "Man, 37, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 7456271
            },
            {
                "name": "Kvinna, 72, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2928550
            },
            {
                "name": "Man, 51, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5586791
            },
            {
                "name": "Man, 77, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2312916
            },
            {
                "name": "Man, 40, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 9255094
            },
            {
                "name": "Man, 90, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 1225929
            },
            {
                "name": "Man, 80, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 1999476
            },
            {
                "name": "Man, 85, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 1523925
            },
            {
                "name": "Kvinna, 54, NORRKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5280369
            },
            {
                "name": "Man, 41, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 6768860
            },
            {
                "name": "Kvinna, 85, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 1528042
            },
            {
                "name": "Man, 77, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2305874
            },
            {
                "name": "Man, 69, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 3247232
            },
            {
                "name": "KARLSSON, JOHAN",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5108447
            },
            {
                "name": "Kvinna, 52, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5506973
            },
            {
                "name": "Man, 92, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 1063025
            },
            {
                "name": "Man, 72, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 9921789
            },
            {
                "name": "Man, 63, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 4170188
            },
            {
                "name": "Ej angivet, 2020, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 8269266
            },
            {
                "name": "Man, 54, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5198638
            },
            {
                "name": "Kvinna, 66, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 9710873
            },
            {
                "name": "Kvinna, 47, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 9730217
            },
            {
                "name": "Kvinna, 53, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5407006
            },
            {
                "name": "Man, 43, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 10101172
            },
            {
                "name": "Kvinna, 39, ÅTVIDABERG",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 7213909
            },
            {
                "name": "Man, 28, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 9000356
            },
            {
                "name": "Man, 42, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 6689153
            },
            {
                "name": "Man, 30, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 9224342
            },
            {
                "name": "Ej angivet, 2020, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 6214067
            },
            {
                "name": "Man, 73, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2842825
            },
            {
                "name": "Man, 47, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 8198955
            },
            {
                "name": "Man, 43, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 6568644
            },
            {
                "name": "Kvinna, 80, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 1999077
            },
            {
                "name": "Man, 80, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 1984199
            },
            {
                "name": "Kvinna, 35, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 8893749
            },
            {
                "name": "Man, 34, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 7948673
            },
            {
                "name": "Man, 39, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 7178770
            },
            {
                "name": "Man, 51, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 7098780
            },
            {
                "name": "Man, 78, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2141842
            },
            {
                "name": "Man, 84, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 1613775
            },
            {
                "name": "Kvinna, 60, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 4562872
            },
            {
                "name": "Kvinna, 76, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2445179
            },
            {
                "name": "Man, 57, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 4864555
            },
            {
                "name": "Kvinna, 72, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2898366
            },
            {
                "name": "Man, 49, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5936663
            },
            {
                "name": "Man, 55, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5146881
            },
            {
                "name": "Man, 65, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 3729503
            },
            {
                "name": "Man, 59, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 4630414
            },
            {
                "name": "Man, 55, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 8866329
            },
            {
                "name": "Kvinna, 50, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 5799688
            },
            {
                "name": "Man, 78, LINKÖPING",
                "listId": "5f3be7b306e7b01a0d45159a",
                "prospectId": 2182430
            }
        ],
        "more": false,
        "total": 85
    },
    "gotAllData": true
}


