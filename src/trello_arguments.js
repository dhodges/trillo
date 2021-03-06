'use strict';

const validFields = [
    'badges',
    'checkItemStates',
    'closed',
    'dateLastActivity',
    'desc',
    'descData',
    'due',
    'email',
    'idAttachmentCover',
    'idBoard',
    'idChecklists',
    'idLabels',
    'idList',
    'idMembers',
    'idMembersVoted',
    'idShort',
    'labels',
    'manualCoverAttachment',
    'name',
    'pos',
    'shortLink',
    'shortUrl',
    'subscribed',
    'url'
  ]

const validActions = [
  'addAttachmentToCard',
  'addChecklistToCard',
  'addMemberToBoard',
  'addMemberToCard',
  'addMemberToOrganization',
  'addToOrganizationBoard',
  'commentCard',
  'convertToCardFromCheckItem',
  'copyBoard',
  'copyCard',
  'copyCommentCard',
  'createBoard',
  'createCard',
  'createList',
  'createOrganization',
  'deleteAttachmentFromCard',
  'deleteBoardInvitation',
  'deleteCard',
  'deleteOrganizationInvitation',
  'disablePowerUp',
  'emailCard',
  'enablePowerUp',
  'makeAdminOfBoard',
  'makeNormalMemberOfBoard',
  'makeNormalMemberOfOrganization',
  'makeObserverOfBoard',
  'memberJoinedTrello',
  'moveCardFromBoard',
  'moveCardToBoard',
  'moveListFromBoard',
  'moveListToBoard',
  'removeChecklistFromCard',
  'removeFromOrganizationBoard',
  'removeMemberFromCard',
  'unconfirmedBoardInvitation',
  'unconfirmedOrganizationInvitation',
  'updateBoard',
  'updateCard',
  'updateCard:closed',
  'updateCard:desc',
  'updateCard:idList',
  'updateCard:name',
  'updateCheckItemStateOnCard',
  'updateChecklist',
  'updateList',
  'updateList:closed',
  'updateList:name',
  'updateMember',
  'updateOrganization'
]

module.exports.validFields  = validFields
module.exports.validActions = validActions
