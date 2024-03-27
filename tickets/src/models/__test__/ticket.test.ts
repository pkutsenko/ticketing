import {Ticket} from "../ticket";


describe('Ticket', () => {
    it('implements optimistic concurrency control', async () => {
        const ticket = new Ticket({
            title: 'concert',
            price: 5,
            userId: '123'
        });

        await ticket.save();

        const firstInstance = await Ticket.findById(ticket.id);
        const secondInstance = await Ticket.findById(ticket.id);

        firstInstance!.set({price: 10});
        secondInstance!.set({price: 15});
        console.log(firstInstance)
        await firstInstance!.save();

        try {
            await secondInstance!.save();
        } catch (err) {
            return;
        }
        throw new Error('Should not reach this point');
    })

    it('increments the version number on multiple saves', async () => {
        const ticket = new Ticket({
            title: 'concert',
            price: 5,
            userId: '123'
        });

        await ticket.save();

        expect(ticket.version).toEqual(0);

        ticket.set({price: 10});

        await ticket.save();

        expect(ticket.version).toEqual(1);
    });
})
