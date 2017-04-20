import "mocha"
import { expect } from "chai"
import { SModelElementSchema, SModelIndex } from "./smodel"
import { SModelFactory } from "./smodel-factory"

describe('model factory', () => {
    it('creates a single element from a schema', () => {
        const factory = new SModelFactory()
        const element = factory.createElement({
            type: 'foo',
            id: 'element1'
        })
        expect(element.id).to.equal('element1')
    })

    it('creates a root element and its chilren from a schema', () => {
        const factory = new SModelFactory()
        const root = factory.createRoot({
            type: 'root',
            id: 'root',
            children: [
                {
                    type: 'element',
                    id: 'element1'
                },
                {
                    type: 'element',
                    id: 'element2',
                    children: [
                        {
                            type: 'element',
                            id: 'element3'
                        }
                    ]
                } as SModelElementSchema
            ]
        })
        const element1 = root.children[0]
        expect(element1.id).to.equal('element1')
        expect(element1.parent.id).to.equal('root')
        const element3 = root.children[1].children[0]
        expect(element3.id).to.equal('element3')
        expect(element3.parent.id).to.equal('element2')
    })
    
    it('detects duplicate ids and throws an error', () => {
        const factory = new SModelFactory()
        const test = () => factory.createRoot({
            type: 'root',
            id: 'root',
            children: [
                {
                    type: 'element',
                    id: 'element1'
                },
                {
                    type: 'element',
                    id: 'element1',
                }
            ]
        })
        expect(test).to.throw(Error)
    })
    
    it('does not overwrite reserved properties', () => {
        const factory = new SModelFactory()
        const root = factory.createRoot({
            type: 'root',
            id: 'root',
            index: 'qwertz',
            children: [
                {
                    type: 'element',
                    id: 'element1',
                    parent: 'foo',
                    children: 'bar',
                    root: 'schnuff'
                }
            ]
        } as any)
        const element1 = root.children[0]
        expect(element1.parent).to.equal(root)
        expect(element1.children).to.deep.equal([])
        expect(element1.root).to.equal(root)
        expect(root.index).to.be.instanceOf(SModelIndex)
    })
})
