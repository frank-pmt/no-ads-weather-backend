import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { createReadStream } from 'fs';
import { LocationService } from './location-service';
import path from 'path';
import { EventEmitter } from 'events';

// Mock fs module
jest.mock('fs', () => ({
    createReadStream: jest.fn()
}));

// Get the mocked version of createReadStream
const mockedCreateReadStream = jest.mocked(createReadStream);

const mockCityData = [
    '2163782	Hawthorn	Hawthorn		-37.81992	145.0358	P	PPLX	AU		07	21110			22322		30	Australia/Melbourne	2022-08-01',
    '2163990	Hampton Park	Hampton Park		-38.03333	145.25	P	PPLX	AU		07	21610			26082		27	Australia/Melbourne	2022-07-31',
    '2164422	Griffith	Griffith	GFF,Griffit,Griffith,gripiti,gryfys,gryfyt  astralya,gurifisu,qryfyt  yyny gwnyy wlz,Гриффит,قریفیت، یئنی گونئی ولز,گریفتھ,گریفیت، استرالیا,گریفیس,გრიფითი,グリフィス	-34.28853	146.05093	P	PPL	AU		02	13450			18154		128	Australia/Sydney	2019-07-18',
    '2164495	Greenvale	Greenvale	Greenvale	-37.63333	144.86667	P	PPLX	AU		07	23270			21274		155	Australia/Melbourne	2022-08-01',
    '2164515	Greensborough	Greensborough		-37.70462	145.10302	P	PPLX	AU		07	20660			21070		75	Australia/Melbourne	2022-08-01',
    '5128581	New York City	New York City	Aebura,Bandar Raya New York,Big Apple,Cathair Nua-Eabhrac,City of New York,Eabhraig Nuadh,Efrog Newydd,Evrek Nowydh,Ga-no-no,Kanon:no,Kanono,Kanón:no,Kota New York,Lungsod ng New York,N\'ju-Jork,NY,NYC,Nea Yorke,Nei Yarrick Schtadt,Neu Amsterdam,Neu Jorck,New Amsterdam,New Orange,New Yorc,New York,New York City,New York Stad,New York borg,New York kenti,New York-borg,New Yorke,New Yorku,Niujorkas,Nju Jork,Njujork,Nouvelle Yorck,Nouvieau York,Nov-Jorko,Nova Amsterda,Nova Iorque,Nova York,Nova-York,Novjorko,Novum Eboracum,Nowy Jork,Nua-Eabhrac,Nueva York,Nujorka,Nyja Jorvik,Nyu York Shehiri,Nòva York,Nýja Jórvík,Thanh pho New York,The Big Apple,Thành phố New York,York Berri,manhattan,n\'yuyorka,ni\'u iyarka siti,niu yue,niu yue shi,niyuyark nakaram,nkhr niwyxrk,nyuyog,nyuyog si,nyuyoku,nyw ywrq,nywywrk,Ņujorka,Νέα Υόρκη,Њу Јорк,Њујорк,Нью-Ёрк,Нью-Йорк,Ню Йорк,ניו יארק,ניו יורק,ניו־יאָרק,نيويورك,نیویارک شہر,نیویورک,न्यूयॉर्क,নিউ ইয়র্ক সিটি,நியூயார்க் நகரம்,นครนิวยอร์ก,ნიუ-იორკი,ニューヨーク,マンハッタン,紐約,紐約市,뉴욕,뉴욕 시	40.71427	-74.00597	P	PPL	US		NY				8804190	10	57	America/New_York	2022-03-09'
].join('\n');


// Mock readable stream
class MockReadableStream extends EventEmitter {
    private data: string;
    public readable: boolean;

    constructor(data: string) {
        super();
        this.data = data;
        this.readable = true;
    }

    // Required methods for readline interface
    pause() { return this; }
    resume() { return this; }
    setEncoding() { return this; }
    destroy() { return this; }

    simulateRead() {
        const lines = this.data.split('\n');
        for (const line of lines) {
            this.emit('data', Buffer.from(line + '\n'));
        }
        this.emit('end');
    }
}

describe('LocationService', () => {
    let locationService: LocationService;
    let mockStream: MockReadableStream;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Create new service instance
        locationService = new LocationService(path.join(__dirname, 'mock/path'));

        // Setup mock stream
        mockStream = new MockReadableStream(mockCityData);
        mockedCreateReadStream.mockReturnValue(mockStream as any);
    });

    describe('lookupLocation', () => {
        test('should return empty matches for short queries', async () => {
            const result = await locationService.lookupLocation('N');
            expect(result).toEqual({
                location: 'N',
                matches: []
            });
            expect(mockedCreateReadStream).not.toHaveBeenCalled();
        });

        test('should find matching US cities', async () => {
            const promise = locationService.lookupLocation('New');
            mockStream.simulateRead();

            const result = await promise;
            expect(result.matches).toHaveLength(3);
            expect(result.matches).toContainEqual({
                name: 'New York',
                fullName: 'New York, NY, US',
                latitude: 40.7128,
                longitude: -74.0060
            });
        });

        test('should find matching non-US cities', async () => {
            const promise = locationService.lookupLocation('New');
            mockStream.simulateRead();

            const result = await promise;
            expect(result.matches).toContainEqual({
                name: 'Newcastle',
                fullName: 'Newcastle, GB',
                latitude: 54.9783,
                longitude: -1.6178
            });
        });

        test('should handle diacritics in search', async () => {
            const promise = locationService.lookupLocation('Néw');
            mockStream.simulateRead();

            const result = await promise;
            expect(result.matches).toHaveLength(3);
        });

        test('should handle case-insensitive search', async () => {
            const promise = locationService.lookupLocation('new');
            mockStream.simulateRead();

            const result = await promise;
            expect(result.matches).toHaveLength(3);
        });

        test('should handle file read errors', async () => {
            const errorMessage = 'Failed to read file';
            mockStream.on('data', () => {
                throw new Error(errorMessage);
            });

            await expect(async () => {
                const promise = locationService.lookupLocation('New');
                mockStream.simulateRead();
                await promise;
            }).rejects.toThrow(`Failed to lookup location: ${errorMessage}`);
        });
    });

    describe('Edge cases', () => {
        test('should handle empty input', async () => {
            const result = await locationService.lookupLocation('');
            expect(result).toEqual({
                location: '',
                matches: []
            });
        });

        test('should handle malformed data lines', async () => {
            const malformedData = 'invalid\tdata';
            const mockStreamWithMalformedData = new MockReadableStream(malformedData);
            mockedCreateReadStream.mockReturnValue(mockStreamWithMalformedData as any);

            const promise = locationService.lookupLocation('invalid');
            mockStreamWithMalformedData.simulateRead();

            const result = await promise;
            expect(result.matches).toHaveLength(0);
        });

        test('should handle null values in data', async () => {
            const dataWithNull = '123\tNew York\tNew York\tNY\tnull\tnull\tP\tPPLA\tUS\t\tNY';
            const mockStreamWithNull = new MockReadableStream(dataWithNull);
            mockedCreateReadStream.mockReturnValue(mockStreamWithNull as any);

            const promise = locationService.lookupLocation('New');
            mockStreamWithNull.simulateRead();

            const result = await promise;
            expect(result.matches[0].latitude).toBe(0);
            expect(result.matches[0].longitude).toBe(0);
        });
    });
});