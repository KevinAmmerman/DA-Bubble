import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Channel, Message } from '../models/channel';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {
  Firestore, collection,
  doc, onSnapshot,
  addDoc, getDoc, updateDoc,
  deleteDoc, orderBy,
  where, query,
  limit,
  collectionData,
  getDocs
} from '@angular/fire/firestore';


interface ChannelsNode {
  channelName: string;
  channelId: string;
  children?: ChannelsNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  channelName: string;
  level: number;
}

@Injectable({
  providedIn: 'root'
})


export class ChannelService {

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubChannelTree = this.subChannelList();
  }


  channelContent: Channel[] = [];
  channelTree: ChannelsNode[] = [];
  themes: any;
  unsubChannel: any;
  unsubChannelTree: any;
  unsubMessage: any;
  unsubChannelContent: any;



  ngOnDestroy() {
    this.unsubChannelTree();
    this.unsubChannel();
    this.unsubChannelContent();

  }

  async addChannel(item: {}, ref: string) {
    await addDoc(this.getRef(ref), item)
      .catch((err) => { console.log(err) })
      .then((docRef: any) => { console.log("Document written with ID", docRef?.id) })
  }

  /* This method takes a collection ID and a document ID as parameters and returns a reference to the specified document in the Firestore database. */
  getRef(ref: any) {
    return collection(this.firestore, ref);
  }

  getSingleDocRef(col: string, docId: string) {
    return doc(collection(this.firestore, col), docId)
  }




  async getDocData(col: string, docId: string) {
    let docRef = this.getSingleDocRef(col, docId);

    // Fetch the actual document data using the getDoc method
    const docSnapshot = await getDoc(docRef);

    // Check if the document exists and print its data
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      return console.log("No such document!");
    }
  }



  getDocumentContent(documentId: string) {
    const docRef = doc(this.getRef('channels'), documentId);
    return this.unsubChannel = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        return this.setChannelContentObj(docSnapshot.data(), docSnapshot.id);
      } else {
        return console.log('Document does not exist!');
      }
    });
  }


  getRefofSubCollection(colId: string, docId: string) { }


  getRefSubcollChannel() {
    return collection(this.firestore, `channels/qWdWhJj21D3vBc2s2fsr/channel_messages`);
  }

  private _transformer = (node: ChannelsNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      channelName: node.channelName,
      channelId: node.channelId,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<ChannelsNode, ExampleFlatNode>(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );



  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  public dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  subChannelList() {
    return this.unsubChannelTree = onSnapshot(this.getRef('channels'), (list: any) => {
      this.channelTree = [];
      list.forEach((element: any) => {
        const channelObj = this.setChannelObj(element.data(), element.id);
        this.channelTree.push(channelObj);
      });
      this.themes = [{ channelName: 'Channels', children: this.channelTree }];
      this.dataSource.data = this.themes;
    });
  }



  setChannelObj(obj: any, docId: string): ChannelsNode {
    return new Channel({
      channelId: docId,
      channelName: obj.channelName,
      creatorId: obj.creatorId,
      description: obj.description,
      creationTime: obj.creationTime,
      createdBy: obj.createdBy,
      children: []
    });
  }

  setChannelContentObj(obj: any, docId: string): Channel {
    return new Channel({
      channelId: docId,
      channelName: obj.channelName,
      creatorId: obj.creatorId,
      description: obj.description,
      creationTime: obj.creationTime,
      createdBy: obj.createdBy
    });
  }




  /*
    subMessageList() {
      return this.unsubMessage = onSnapshot(this.getRef('directMessages'), (list: any) => {
        this.messageTree = [];
        list.forEach((element: any) => {
          const messageObj = this.setMessageObj(element.data(), element.id);
          this.messageTree.push(messageObj);
        });
        this.themes = [{ channelName: 'directMessages', children: this.messageTree }];
        this.dataSource.data = this.themes;
      });
    }
  
  setMessageObj(obj: any, docId: string): MessagesNode {
      return new Message({
        MessageId: docId,
        users: obj.users,
        description: obj.description,
        creationTime: obj.creationTime,
        createdBy: obj.createdBy,
        children: []
      });
    } */




  /*   addChannel(newChannel: string, collection: string)  {
      newChannel.toJSON(collection)
    } */

  getDateTime() {
    let dateTime = new Date();
    return dateTime
  }


  getChannelMessages(id: string) {
    const channelMessages$ = collectionData(this.getRefSubcollChannel());
    return channelMessages$
  }

  async addMessageToChannel(message: any) {
    const docRef = addDoc(this.getRefSubcollChannel(), message);
  }

  async getChannels() {
    const itemCollection = collection(this.firestore, 'channels');
    const channelArray: any[] = [];
    const querySnapshot = await getDocs(itemCollection);
    querySnapshot.forEach(doc => {
      const channel = this.setChannelObj(doc.data(), doc.id);
      channelArray.push(channel);
    });
    return channelArray;
  }

}
