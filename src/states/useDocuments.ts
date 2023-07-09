import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';

import api from '@/data/api';
import {IDocumentAttribute, IDocumentCreate, IGetDocuments, IUpdateDocument} from '@/data/api/types/documents.type';

type State = {
  error: boolean;
  isFeching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  currentDocument: IDocumentAttribute;
  documents: IGetDocuments[];
};

type Action = {
  getAllDocument: (listId: string) => void;
  getDocument: (id: string) => void;
  updateDocument: (data: IUpdateDocument) => void;
  createDocument: (data: IDocumentCreate) => void;
};

export const useDocumentsStore = create<State & Action>()(
  devtools(
    immer(set => ({
      documents: [],
      error: false,
      isFeching: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      currentDocument: {} as IDocumentAttribute,
      getAllDocument: async listId => {
        try {
          set(
            state => {
              state.isFeching = true;
            },
            false,
            'documents/getDocuments'
          );
          const res = await api.documents.getListDocument(listId);
          set(
            state => {
              state.isFeching = false;
              state.documents = res.data;
              if (!state.currentDocument?.id) state.currentDocument = state.documents?.[0];
              else state.currentDocument = {} as IDocumentAttribute;
            },
            false,
            'documents/getAllDocumentSucces'
          );
        } catch (error) {
          set(
            state => {
              state.error = true;
              state.isFeching = false;
            },
            false,
            'documents/getDocumentsFail'
          );
        }
      },
      getDocument: id => {
        set(
          state => {
            const result = state.documents.findIndex(document => document.id === id);
            if (result !== -1) {
              state.currentDocument = state.documents[result];
            }
          },
          false,
          'documents/getDocumentSucces'
        );
      },
      createDocument: async data => {
        try {
          const res = await api.documents.create(data);
          set({isCreating: true}, false, 'createDocument');
          set(
            state => {
              state.currentDocument = res.data;
              state.isCreating = false;
            },
            false,
            'documents/createDocumentSucces'
          );
        } catch (error) {
          set(
            state => {
              state.error = true;
              state.isCreating = false;
            },
            false,
            'documents/createDocumentFail'
          );
        }
      },
      updateDocument: async data => {
        try {
          const res = await api.documents.updateDocument(data);
          set({isUpdating: true}, false, 'updateDocument');
          set(
            state => {
              state.currentDocument = res.data;
              state.isUpdating = false;
            },
            false,
            'documents/updateDocumentSucces'
          );
        } catch (error) {
          set(
            state => {
              state.error = true;
              state.isUpdating = false;
            },
            false,
            'documents/updateDocumentFail'
          );
        }
      }
    }))
  )
);
