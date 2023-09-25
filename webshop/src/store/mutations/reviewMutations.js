export default  {
    deleteReview(state, reviewId) {
        while (state.review_imageS.find((i) => i.review_id === reviewId)) {
            let idToDelete = state.review_imageS.find((i) => i.review_id === reviewId).images_id;
            this.commit('deleteReviewImage', { idToDelete })
        }
        state.reviewS = state.reviewS.filter((r) => r.review_id !== reviewId);
        state.users_reviewS = state.users_reviewS.filter((r) => r.review_id !== reviewId);
    },
    addToReview(state, review) {
        state.reviewS.push(review);
        let newUsersReviews = {
            user_id: state.curUserId,
            review_id: review.review_id
        };
        state.users_reviewS.push(newUsersReviews);
    },
    addImageToReview(state, payload) {
        const {url, review_id}  = payload;
        const maxId = state.review_imageS.reduce((max, obj) => obj.images_id > max ? obj.images_id : max, 0);
        let newReview_Images = {
            review_id: review_id,
            images_id: maxId + 1,
        };
        state.review_imageS.push(newReview_Images);
        let newReview_Image = {
            id: maxId + 1,
            url: url
        };
        state.review_image.push(newReview_Image);
    },
    deleteReviewImage(state, payload) {
        const {idToDelete} = payload;
        state.review_image = state.review_image.filter((r) => r.id !== idToDelete);
        state.review_imageS = state.review_imageS.filter((r) => r.images_id !== idToDelete);
    }
}