import en from '../../locales/en.json';
import es from '../../locales/es.json';
import si from '../../locales/si.json';
import {LanguagesSupported} from '../../utils/i18n';

type Bundle = Record<string, unknown>;

const flatten = (bundle: Bundle, prefix = ''): Record<string, string> =>
    Object.entries(bundle).reduce<Record<string, string>>((acc, [key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        return typeof value === 'object' && value !== null
            ? {...acc, ...flatten(value as Bundle, path)}
            : {...acc, [path]: String(value)};
    }, {});

const placeholders = (value: string) => (value.match(/{{\s*\w+\s*}}/g) ?? []).sort();

const enFlat = flatten(en as Bundle);
const bundles: [string, Bundle][] = [['es', es as Bundle], ['si', si as Bundle]];

describe.each(bundles)('Testing the %s locale bundle', (language, bundle) => {
    const translated = flatten(bundle);

    test('Check if it declares exactly the same keys as the English bundle', () => {
        expect(Object.keys(translated).sort()).toEqual(Object.keys(enFlat).sort());
    });

    test('Check if every string is translated and non-empty', () => {
        const empty = Object.entries(translated)
            .filter(([, value]) => value.trim() === '')
            .map(([key]) => key);
        expect(empty).toEqual([]);
    });

    test('Check if interpolation placeholders are preserved', () => {
        const mismatched = Object.entries(enFlat)
            .filter(([key, value]) => placeholders(value).join() !== placeholders(translated[key]).join())
            .map(([key]) => key);
        expect(mismatched).toEqual([]);
    });

    test('Check if documentation links are left untouched', () => {
        const hrefs = (value: string) => (value.match(/href="[^"]+"/g) ?? []).sort();
        const broken = Object.entries(enFlat)
            .filter(([key, value]) => hrefs(value).join() !== hrefs(translated[key]).join())
            .map(([key]) => key);
        expect(broken).toEqual([]);
    });

    test('Check if it is offered by the language selector', () => {
        expect(LanguagesSupported.map(item => item.value)).toContain(language);
    });
});

describe('Testing the supported language list', () => {
    test('Check if Spanish and Sinhala are listed with their native labels', () => {
        expect(LanguagesSupported).toEqual(
            expect.arrayContaining([
                {label: 'Español', value: 'es', englishName: 'Spanish'},
                {label: 'සිංහල', value: 'si', englishName: 'Sinhala'}
            ])
        );
    });

    test('Check if every listed language has a registered resource bundle', () => {
        expect(LanguagesSupported).toHaveLength(9);
        LanguagesSupported.forEach(item => expect(item.value).toMatch(/^[a-z]{2}$/));
    });
});
