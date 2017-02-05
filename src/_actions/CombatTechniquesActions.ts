import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter(text: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_TALENTS,
			text
		});
	},
	sort(option: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_COMBATTECHNIQUES,
			option
		});
	},
	addPoint(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
			id
		});
	},
	removePoint(id: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
			id
		});
	}
};
