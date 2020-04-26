#### FYI

If you experience problem with paths after installment of a module, run 'npm install' so aliases is set.

To run this during development some small fixes is required in bilprospekt-2.0 backend. For now you can simply pull branch '3.0' and do 'npm install' in backend.

#### To start:

npm install

npm run sass (for styles)

npm start

#### Application structure brainstorm and notes

We shouldn't need to import redux dispatcher to components (via mapDispatchToProps). Instead put all functions that touch store state (and use dispatcher) from store/subdomain/tasks.ts. tasks.ts should handle all tasks that affect that domain of the store state. I.E. store/user/tasks.ts handles everything that affects state.user.

We should map redux state to components wherever we need it, we should try and limit the use of props as much as we can. This way we can reuse components in different places. Try and keep them clean and not dependent of other components (disregarding subcomponents of course). I.E. we should be able to use <Events/> everywhere on the site.

Since we use redux store everywhere we should try and keep the use of local state in components to a minimal. It should of course be used where a component need to store a state that we should not have in redux. But we should not retrieve state from store and save it in a local component state.

We use typescript in /store.

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

To use props with redux state:
`const MapStateToProps = (state, props) => {
    return {
        prospect: state.prospect,
        props: props,
    }
}`
then access it via state.props.

Try and user request_helper for requests to keep the store tasks clean. If we need a different format, write a new helper.

Note that we deprecate some helpers in the shared_helpers module, and put new rewritten helpers in /helpers. 

When it comes to styles, we should only extend classes that are in the root folder. I.E. from _shared.sass or _text_general.sass, not content/_deal.sass. Same with variables, keep everything that is shared in root folder.
