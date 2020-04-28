import store from './store';

export const _show_modal = () => {
    const action = {
        type: 'change_modal_visible',
        data: true,
    };
    store.dispatch(action);
};
export const _hide_modal = () => {
    const action = {
        type: 'change_modal_visible',
        data: false,
    };
    store.dispatch(action);
};