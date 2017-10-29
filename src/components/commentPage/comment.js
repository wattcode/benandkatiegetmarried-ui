import guid from 'uuid/v4';

const Comment = function(messageBoardId, hierarchy, text, attribution) {
    this.id = guid();
    this.date = new Date().toISOString();    
    this.text = text
    this.attributions = attribution
    this.likes = [];
    this.messageBoardId = messageBoardId
    this.hierarchy = hierarchy
}

export default Comment