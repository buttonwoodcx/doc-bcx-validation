import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {createAssertionQueue, fireEvent} from '../../utils';

const nq = createAssertionQueue();

describe('number binding-behavior', () => {
  let component;
  let model;

  beforeEach(() => {
    model = {value: null};
  });

  describe('Default', () => {
    beforeEach(() => {
      component = StageComponent
        .withResources('resources/binding-behaviors/number')
        .inView('<input value.bind="value & number">')
        .boundTo(model);
    });

    it('should render input with value', done => {
      component.create(bootstrap).then(() => {
        const input = document.querySelector('input');
        expect(input.value).toBe('');
        expect(model.value).toBe(null);
        done();
      }).catch(e => { console.log(e.toString()); });
    });

    it('accepts number, not others', done => {
      component.create(bootstrap).then(() => {
        const input = document.querySelector('input');
        input.value = '9a0';
        fireEvent(input, 'change');

        nq(() => {
          expect(input.value).toBe('90');
          expect(model.value).toBe(90);
        });
        nq(done);
      }).catch(e => { console.log(e.toString()); });
    });

    it('empty string is null for number', done => {
      component.create(bootstrap).then(() => {
        const input = document.querySelector('input');
        input.value = '9a0';
        fireEvent(input, 'change');

        nq(() => {
          expect(input.value).toBe('90');
          expect(model.value).toBe(90);
        });
        nq(() => {
          input.value = '';
          fireEvent(input, 'change');
        });
        nq(() => {
          expect(input.value).toBe('');
          expect(model.value).toBe(null);
        });
        nq(done);
      }).catch(e => { console.log(e.toString()); });
    });

    it('by default, does not accept negative value', done => {
      component.create(bootstrap).then(() => {
        const input = document.querySelector('input');
        input.value = '-09';
        fireEvent(input, 'change');

        nq(() => {
          expect(input.value).toBe('09');
          expect(model.value).toBe(9);
        });
        nq(done);
      }).catch(e => { console.log(e.toString()); });
    });

    it('does not support scientific (exponential) notation', done => {
      component.create(bootstrap).then(() => {
        const input = document.querySelector('input');
        input.value = '1e2';
        fireEvent(input, 'change');

        nq(() => {
          expect(input.value).toBe('12');
          expect(model.value).toBe(12);
        });
        nq(done);
      }).catch(e => { console.log(e.toString()); });
    });

    it('by default, accepts float number', done => {
      component.create(bootstrap).then(() => {
        const input = document.querySelector('input');
        input.value = '0.23';
        fireEvent(input, 'change');

        nq(() => {
          expect(input.value).toBe('0.23');
          expect(model.value).toBe(0.23);
        });
        nq(done);
      }).catch(e => { console.log(e.toString()); });
    });

    it('cleanup float number', done => {
      component.create(bootstrap).then(() => {
        const input = document.querySelector('input');
        input.value = '0.23.45';
        fireEvent(input, 'change');

        nq(() => {
          expect(input.value).toBe('0.2345');
          expect(model.value).toBe(0.2345);
        });
        nq(done);
      }).catch(e => { console.log(e.toString()); });
    });
  });

  describe('turn off float number', () => {
    beforeEach(() => {
      component = StageComponent
        .withResources('resources/binding-behaviors/number')
        .inView('<input value.bind="value & number:{integerOnly:true}">')
        .boundTo(model);
    });

    it('reject float number', done => {
      component.create(bootstrap).then(() => {
        const input = document.querySelector('input');
        input.value = '0.23';
        fireEvent(input, 'change');

        nq(() => {
          expect(input.value).toBe('023');
          expect(model.value).toBe(23);
        });
        nq(done);
      }).catch(e => { console.log(e.toString()); });
    });
  });

  describe('allow negative', () => {
    beforeEach(() => {
      component = StageComponent
        .withResources('resources/binding-behaviors/number')
        .inView('<input value.bind="value & number:{allowNegative:true}">')
        .boundTo(model);
    });

    it('allows negative value', done => {
      component.create(bootstrap).then(() => {
        const input = document.querySelector('input');
        input.value = '-9.32';
        fireEvent(input, 'change');

        nq(() => {
          expect(input.value).toBe('-9.32');
          expect(model.value).toBe(-9.32);
        });
        nq(done);
      }).catch(e => { console.log(e.toString()); });
    });

    it('cleanups negative value', done => {
      component.create(bootstrap).then(() => {
        const input = document.querySelector('input');
        input.value = '-09-2.4';
        fireEvent(input, 'change');

        nq(() => {
          expect(input.value).toBe('-092.4');
          expect(model.value).toBe(-92.4);
        });
        nq(done);
      }).catch(e => { console.log(e.toString()); });
    });

  });

  afterEach(() => {
    if (component) {
      component.dispose();
      component = null;
    }
  });
});


