"use strict";
function getCreatureData() {
    return {
        ecosystems: {
            Ground: {
                '': {
                    commonName: '',
                    produces: ['']
                },
                Anastomus: {
                    commonName: 'Striders',
                    produces: ['Tall Eggs']
                },
                Anomalous: {
                    commonName: 'Exotic Biome Creatures',
                    produces: ['', 'Fiendish Roe', 'Hexaberry', 'Latticed Sinew']
                },
                Arthropodae: {
                    commonName: 'Bugs',
                    produces: ['Nourishing Slime']
                },
                Bos: {
                    commonName: 'Beetles',
                    produces: ["Crab 'Apple'"]
                },
                Bosoptera: {
                    commonName: 'Flying Beetles',
                    produces: ['Craw Milk']
                },
                Felidae: {
                    commonName: 'Cats',
                    produces: ['Leopard-Fruit']
                },
                Felihex: {
                    commonName: 'Sixlegged Cats',
                    produces: ['Leopard-Fruit']
                },
                Floradae: {
                    commonName: 'Plant Cats',
                    produces: ['Syrupy Nectar']
                },
                Hexungulatis: {
                    commonName: 'Sixlegged Cows',
                    produces: ['Fresh Milk']
                },
                Lok: {
                    commonName: 'Blobs',
                    produces: ["Sticky 'Honey'"]
                },
                Mechanoceris: {
                    commonName: 'Robots',
                    produces: ['Chewy Wires']
                },
                Mogara: {
                    commonName: 'Proto-Gek',
                    produces: ['Warm Proto-Milk']
                },
                Osteofelidae: {
                    commonName: 'Bonecat',
                    produces: ['Bone Nuggets']
                },
                Prionterrae: {
                    commonName: 'Ploughs',
                    produces: ['Dirty Meat']
                },
                Procavya: {
                    commonName: 'Rodents',
                    produces: ['Wild Milk']
                },
                Protosphaeridae: {
                    commonName: 'Protoroller',
                    produces: ['Bone Nuggets']
                },
                Prototerrae: {
                    commonName: 'Protodiggers',
                    produces: ['Dirty Meat']
                },
                Rangifae: {
                    commonName: 'Diplos',
                    produces: ['Giant Egg']
                },
                Reococcyx: {
                    commonName: 'Bipedal Antelopes',
                    produces: ['Wild Milk']
                },
                Spiralis: {
                    commonName: 'Drills',
                    produces: ['Latticed Sinew']
                },
                Stucturae: {
                    commonName: 'Walking Buildings',
                    produces: ['Chewy Wires']
                },
                Talpidae: {
                    commonName: 'Moles',
                    produces: ['Foraged Mushrooms']
                },
                Tetraceris: {
                    commonName: 'Antelopes',
                    produces: ['Wild Milk']
                },
                Theroma: {
                    commonName: 'Triceratops',
                    produces: ['Creature Egg']
                },
                Tyranocae: {
                    commonName: 'Tyrannosaurus',
                    produces: ['Regis Grease']
                },
                Ungulatis: {
                    commonName: 'Cow',
                    produces: ['Fresh Milk']
                }
            },
            Flying: {
                '': {
                    commonName: '',
                    produces: ['']
                },
                Agnelis: {
                    commonName: 'Birds',
                    produces: ['Craw Milk']
                },
                Cycromys: {
                    commonName: 'Dragons',
                    produces: ['Craw Milk']
                },
                Oxyacta: {
                    commonName: 'Flying Snakes',
                    produces: ['Craw Milk']
                },
                Protocaeli: {
                    commonName: 'Protoflyers',
                    produces: ['Craw Milk']
                },
                Rhopalocera: {
                    commonName: 'Butterflies',
                    produces: ['Craw Milk']
                }
            },
            Underwater: {
                '': {
                    commonName: '',
                    produces: ['']
                },
                Procavaquatica: {
                    commonName: 'Swimming Rodents',
                    produces: ['Wild Milk']
                },
                Bosaquatica: {
                    commonName: 'Underwater Crabs',
                    produces: ["Crab 'Apple'"]
                },
                Chrysaora: {
                    commonName: 'Jellyfish',
                    produces: ['Wild Milk']
                },
                Ictaloris: {
                    commonName: 'Fish',
                    produces: ['']
                },
                Prionace: {
                    commonName: 'Sharks',
                    produces: ['Wild Milk']
                },
                Prionacefda: {
                    commonName: 'Swimming cows',
                    produces: ['Wild Milk']
                },
                Mobula: {
                    commonName: 'Manta Rays',
                    produces: ['']
                },
                Hippocampus: {
                    commonName: 'Seahorses',
                    produces: ['']
                },
                Crustacea: {
                    commonName: 'Prawns',
                    produces: ['']
                },
                Krakenidae: {
                    commonName: 'Squids',
                    produces: ['']
                }
            },
            Underground: {
                '': {
                    commonName: '',
                    produces: ['']
                },
                Bos: {
                    commonName: 'Beetles',
                    produces: ["Crab 'Apple'"]
                },
                Lok: {
                    commonName: 'Blobs',
                    produces: ["Sticky 'Honey'"]
                },
                Procavya: {
                    commonName: 'Rodents',
                    produces: ['Wild Milk']
                },
                Prototerrae: {
                    commonName: 'Protodiggers',
                    produces: ['Dirty Meat']
                }
            }
        },
        catalogs: {
            Euclid: {
                Ground: ['', 'Diplo', '8m+ Fauna', 'Mushroom Beetle', 'T-Rex', 'Strider', 'Bonecat', 'Robot Antelope', 'Bug', 'Triceratops', 'Flying Beetle', 'Blob', 'Mogara', 'Protoroller', 'Prospects'],
                Flying: ['', 'Butterfly', 'Sporefly', 'Large Butterfly', 'Protoflyer', 'Prospects'],
                Underwater: ['', 'Prionace', 'Jellyfish', 'Prospects'],
                Underground: ['', 'Mushroom Beetle', 'Blob']
            },
            Calypso: {
                Ground: ['', 'Diplo', '8m+ Fauna', 'Mushroom Beetle', 'T-Rex', 'Strider', 'Bonecat', 'Robot Antelope', 'Bug', 'Triceratops', 'Flying Beetle', 'Blob', 'Mogara', 'Protoroller', 'Prospects'],
                Flying: ['', 'Butterfly', 'Sporefly', 'Large Butterfly', 'Protoflyer', 'Prospects'],
                Underwater: ['', 'Prionace', 'Jellyfish', 'Prospects'],
                Underground: ['', 'Mushroom Beetle', 'Blob']
            },
            Eissentam: {
                Ground: ['', 'Diplo', '8m+ Fauna', 'Mushroom Beetle', 'T-Rex', 'Strider', 'Bonecat', 'Robot Antelope', 'Bug', 'Triceratops', 'Flying Beetle', 'Blob', 'Mogara', 'Protoroller', 'Prospects'],
                Flying: ['', 'Butterfly', 'Sporefly', 'Large Butterfly', 'Protoflyer', 'Prospects'],
                Underwater: ['', 'Prionace', 'Jellyfish', 'Prospects'],
                Underground: ['', 'Mushroom Beetle', 'Blob']
            }
        }
    };
}
