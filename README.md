#### FYI

Remember that you have to create npm links after any npm install, unless you use safe install.

Backend branch 3.0 with cors required to access current data sources. For local development you can pull branch '3.0' in bilprospekt-2.0 and do npm install in backend.


#### To start:

npm install

npm run create-links

npm run sass (for styles)

npm start

#### Application structure brainstorm

We shouldn't need to import redux dispatcher to components (via mapDispatchToProps). Instead put all functions that touch store state (and use dispatcher) from store/subdomain/tasks.js. tasks.js should handle all tasks that affect that domain of the store state. I.E. store/user/tasks.js handles everything that affects state.user.

We should map redux state to components wherever we need it, we should try and limit the use of props as much as we can. This way we can reuse components in different places. Try and keep them clean and not dependent of other components (disregarding subcomponents of course). I.E. we should be able to import GroupsComponent everywhere on the site.

Since we use redux store everywhere we should try and keep the use of local state in components to a minimal. It should of course be used where a component need to store a state that we should not have in redux. But we should not retrieve state from store and save it in a local component state.

When we retrieve store state from a component (via mapStateToProps), we should always import it with a property name. I.E. do this:
`const MapStateToProps = (state) => {
    return {
        prospect: state.prospect,
    }
}`
and not:
`const MapStateToProps = (state) => {
     return state.prospect
 }` 
because more often than not we're going to use multiple parts of the store.

Try and user request_helper for requests to keep the store tasks clean. If we need a different format, write a new helper. If we want to update/change request library we only need to do it in request_helper. Use this approach wherever it's applicable.

Since we're gonna use service worker other techniques like memoize and swr is sort of redundant and would only add layers of complexity without adding much.
